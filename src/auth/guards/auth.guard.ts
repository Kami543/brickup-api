import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from 'src/common/decorators/public.decorator';
import { UserRepository } from 'src/user/user.repository';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly userRepository: UserRepository, 
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token não enviado');
    }

    try {
      // Verifica o token JWT
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      // Busca o usuário completo com organização e assinatura
      const user = await this.userRepository.findByIdWithOrganization(
        payload.sub,
      );

      // Validações do usuário
      if (!user) {
        throw new UnauthorizedException('Usuário não encontrado');
      }

      // Valida versão do token (para logout/invalidação)
      if (payload.tokenVersion !== user.tokenVersion) {
        throw new UnauthorizedException('Token inválido - versão desatualizada');
      }

      // Valida assinatura da organização
      if (
        user.organization?.subscription &&
        user.organization.subscription.status === 'EXPIRED'
      ) {
        throw new ForbiddenException('Assinatura expirada');
      }

      // Anexa o usuário completo ao request
      request['user'] = user;
      request['tokenPayload'] = payload;

      return true;
    } catch (error) {
      this.logger.error('Erro na autenticação', error.stack);
      
      if (error instanceof ForbiddenException) {
        throw error;
      }
      
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    if (!authHeader) return undefined;

    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}