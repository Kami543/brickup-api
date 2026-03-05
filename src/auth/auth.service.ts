import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  // LOGIN
  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) throw new UnauthorizedException('Credenciais inválidas');

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid)
      throw new UnauthorizedException('Credenciais inválidas');

    return this.generateTokens(user);
  }

  // GERAR TOKENS
  private async generateTokens(user: User) {
    const payload = {
      sub: user.id,
      orgId: user.organizationId,
      role: user.role,
      tokenVersion: user.tokenVersion,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });

    const hashedRefresh = await bcrypt.hash(refreshToken, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        refreshToken: hashedRefresh,
      },
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  // REFRESH TOKEN
  async refresh(userId: string, refreshToken: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.refreshToken)
      throw new ForbiddenException('Acesso negado');

    const refreshValid = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );

    if (!refreshValid)
      throw new ForbiddenException('Refresh inválido');

    return this.generateTokens(user);
  }

  // LOGOUT
  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }

  // TROCAR SENHA
  async changePassword(userId: string, newPassword: string) {
    const hashed = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        password: hashed,
        tokenVersion: { increment: 1 },
        refreshToken: null,
      },
    });
  }
}