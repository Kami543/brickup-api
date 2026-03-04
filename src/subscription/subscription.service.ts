import { Injectable, Logger } from "@nestjs/common";
import { SubscriptionRepository } from "./subscription.repository";
import { Subscription, SubscriptionStatus } from "@prisma/client";

@Injectable()
export class SubscriptionService {
    private readonly logger = new Logger(SubscriptionService.name);
    constructor(private readonly subscriptionRepository: SubscriptionRepository) {}

    async createSubscription(organizationId: string, planId: string):Promise<Subscription> {
        this.logger.log(`Criando assinatura para organização ${organizationId} com plano ${planId}`);
        return this.subscriptionRepository.create({
            data: {
                organizationId,
                planId,
            },
        });
    }

   

    async updateSubscription(organizationId: string, status?: SubscriptionStatus, endDate?: Date): Promise<Subscription> {
        this.logger.log(`Atualizando assinatura para organização ${organizationId} com status ${status} e data de término ${endDate}`);
        return this.subscriptionRepository.updateSubscription(organizationId, status, endDate);
    }

    async getSubscriptionByOrganizationId(organizationId: string): Promise<Subscription | null> {
        this.logger.log(`Buscando assinatura para organização ${organizationId}`);
        return this.subscriptionRepository.getSubscriptionByOrganizationId(organizationId);
    }

    async findByOrganizationId(organizationId: string): Promise<Subscription | null> {
        this.logger.log(`Buscando assinatura para organização ${organizationId}`);
        return this.subscriptionRepository.findByOrganizationId(organizationId);
    }

    async cancelSubscription(organizationId: string): Promise<Subscription> {
        this.logger.log(`Cancelando assinatura para organização ${organizationId}`);
        return this.subscriptionRepository.updateSubscription(organizationId, SubscriptionStatus.CANCELED, new Date());
    }

}