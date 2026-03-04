import { Injectable } from "@nestjs/common";
import { Organization } from "@prisma/client";
import { BaseRepository } from "src/common/utils/baseRepository";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class OrganizationRepository extends BaseRepository<Organization> {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }

  protected get Model() {
    return this.prisma.organization;
  }
  
  async findBySlug(slug: string):Promise<Organization  | null> {
    return this.prisma.organization.findUnique({
      where: { slug },
    });
  }
  
}