import { Injectable } from "@nestjs/common";
import { Subscription, SubscriptionStatus } from "@prisma/client";
import { BaseRepository } from "src/common/utils/baseRepository";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class SubscriptionRepository extends BaseRepository<Subscription> {
    constructor(protected readonly prisma: PrismaService) {
        super(prisma);
    }

    protected get model() {
        return this.prisma.subscription;
    }

    async getSubscriptionByOrganizationId(organizationId: string): Promise<Subscription | null> {
        return this.model.findUnique({
            where: {
                organizationId,
            },
        });
    }



    async findByOrganizationId(organizationId: string): Promise<Subscription | null> {
        return this.model.findUnique({
            where: {
                organizationId,
            },
        });
    }

    async updateSubscription(organizationId: string, status?: SubscriptionStatus, endDate?: Date): Promise<Subscription> {
        return this.model.update({
            where: {
                organizationId,
            },
            data: {
                status,
                endDate,
            },
        });
    }

}