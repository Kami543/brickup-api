import { Injectable } from "@nestjs/common";
import { Plan } from "@prisma/client";
import { BaseRepository } from "src/common/utils/baseRepository";
import { PrismaService } from "src/prisma/prisma.service";
import { PlanType } from '@prisma/client';


@Injectable()
export class PlanRepository extends BaseRepository<Plan> {
    constructor(protected readonly prisma: PrismaService) {
        super(prisma)
    }

    protected get model() {
        return this.prisma.plan;
    }

    async findByName(name: PlanType): Promise<Plan | null> {
        return this.model.findFirst({
            where: {
                name,
            },
        });
    }

    async findByOrganizationId(organizationId: string): Promise<Plan | null> {
        const subscription = await this.prisma.subscription.findUnique({
            where: {
                organizationId,
            },
            include: {
                plan: true,
            },
        });

        return subscription?.plan || null;
    }


}