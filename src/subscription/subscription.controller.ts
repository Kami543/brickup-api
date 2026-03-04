import { Get, HttpCode, Injectable, Logger, Put } from "@nestjs/common";
import { SubscriptionService } from "./subscription.service";
import { Subscription } from "@prisma/client";

@Injectable()
export class SubscriptionController {
    private readonly logger = new Logger(SubscriptionController.name);
    constructor(private readonly subscriptionService: SubscriptionService) { }

    @Get()
    @HttpCode(200)
    async createSubscription(organizationId: string, planId: string): Promise<Subscription> {
        this.logger.log(`Criando assinatura para organização ${organizationId} com plano ${planId}`);
        return this.subscriptionService.createSubscription(organizationId, planId);
    }

    @Put()
    async updateSubscription(organizationId: string, status?: string, endDate?: Date): Promise<Subscription> {
        this.logger.log(`Atualizando assinatura para organização ${organizationId} com status ${status} e data de término ${endDate}`);
        return this.subscriptionService.updateSubscription(organizationId, status as any, endDate);
    }

    @Get(":organizationId")
    async getSubscriptionByOrganizationId(organizationId: string): Promise<Subscription | null> {
        this.logger.log(`Buscando assinatura para organização ${organizationId}`);
        return this.subscriptionService.getSubscriptionByOrganizationId(organizationId);
    }

    @Put("cancel")
    async cancelSubscription(organizationId: string): Promise<Subscription> {
        this.logger.log(`Cancelando assinatura para organização ${organizationId}`);
        return this.subscriptionService.cancelSubscription(organizationId);
    }

}
