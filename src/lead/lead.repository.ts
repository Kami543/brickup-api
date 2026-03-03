import { Injectable } from "@nestjs/common";
import { Lead } from "@prisma/client";
import { BaseRepository } from "src/common/utils/baseRepository";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class LeadRepository extends BaseRepository<Lead> {
    constructor(protected readonly prisma:PrismaService){
        super(prisma)
    }

    protected get Model(){
        return this.prisma.lead;
    }

    async findByEmail(email: string): Promise<Lead | null> {
        return this.Model.findFirst({
            where: {
                email,
            },
        });
    }

    async findByOrganizationId(organizationId: string): Promise<Lead[]> {
        return this.Model.findMany({
            where: {
                organizationId,
            },
        });
    }

    async deleteByOrganizationId(organizationId: string): Promise<void> {
        await this.Model.deleteMany({
            where: {
                organizationId,
            },
        });
    }

    async deleteByEmail(email: string): Promise<void> {
        await this.Model.deleteMany({
            where: {
                email,
            },
        });
    }

}
 