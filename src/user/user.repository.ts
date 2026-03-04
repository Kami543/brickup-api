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

}