import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BaseRepository } from 'src/common/utils/baseRepository';
import { Role, User } from '@prisma/client';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }

  protected get Model() {
    return this.prisma.user;
  }

  // Buscar por email
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  // Buscar usuários por organização
  async findByOrganization(organizationId: string) {
    return this.prisma.user.findMany({
      where: {
        organizationId,
        deletedAt: null,
      },
    });
  }

  // Buscar por role
  async findByRole(role: Role) {
    return this.prisma.user.findMany({
      where: {
        role,
        deletedAt: null,
      },
    });
  }

  // Buscar usuário por ID com organização e assinatura
  async findByIdWithOrganization(id: string) {
    return this.prisma.user.findUnique({
      where: { 
        id,
        deletedAt: null // Garante que não está deletado
      },
      include: {
        organization: {
          include: {
            subscription: true // Inclui a assinatura da organização
          }
        }
      }
    });
  }

  //  Atualizar tokenVersion (para logout/invalidação)
  async incrementTokenVersion(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: {
        tokenVersion: {
          increment: 1
        }
      }
    });
  }

  //  Limpar refresh token
  async clearRefreshToken(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: {
        refreshToken: null
      }
    });
  }

  // Atualizar refresh token
  async updateRefreshToken(id: string, refreshToken: string | null) {
    return this.prisma.user.update({
      where: { id },
      data: {
        refreshToken
      }
    });
  }

  //  Buscar usuário válido (não deletado)
  async findActiveById(id: string) {
    return this.prisma.user.findFirst({
      where: {
        id,
        deletedAt: null
      }
    });
  }

  // Buscar usuário com refresh token válido
  async findByRefreshToken(userId: string, refreshToken: string) {
    // Nota: Como o refresh token está hashed, não podemos buscar diretamente por ele
    // Este método busca o usuário e você compara o token depois
    return this.prisma.user.findFirst({
      where: {
        id: userId,
        deletedAt: null,
        refreshToken: {
          not: null
        }
      }
    });
  }

  //Atualizar senha e incrementar tokenVersion
  async updatePassword(id: string, hashedPassword: string) {
    return this.prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword,
        tokenVersion: {
          increment: 1
        },
        refreshToken: null // Invalida todos os refresh tokens
      }
    });
  }
}