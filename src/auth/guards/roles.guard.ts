import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';

/**
 * Guard para verificar se o usuário tem as roles necessárias
 *
 * @example
 * ```typescript
 * @RequireRoles(Role.OWNER, Role.ADMIN)
 * @UseGuards(AuthGuard, RolesGuard)
 * async createLead() { ... }
 * ```
 */
@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Buscar roles necessárias do decorator @RequireRoles()
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Se não há roles definidas, permite acesso
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Verificar se usuário está autenticado
    if (!user) {
      this.logger.warn('Usuário não autenticado tentando acessar recurso protegido');
      throw new ForbiddenException('Usuário não autenticado');
    }

    // Verificar se usuário tem role (campo direto no User)
    if (!user.role) {
      this.logger.warn(`Usuário ${user.email} não possui role definida`);
      throw new ForbiddenException('Usuário não possui permissões definidas');
    }

    // Verificar se usuário tem pelo menos uma das roles necessárias
    const hasRole = requiredRoles.includes(user.role);

    if (!hasRole) {
      this.logger.warn(
        `Usuário ${user.email} com role ${user.role} tentou acessar recurso que requer [${requiredRoles.join(', ')}]`,
      );
      throw new ForbiddenException(
        `Você não tem permissão para acessar este recurso. Role necessária: ${requiredRoles.join(' ou ')}`,
      );
    }

    this.logger.debug(
      `Usuário ${user.email} autorizado com role: ${user.role}`,
    );

    return true;
  }
}