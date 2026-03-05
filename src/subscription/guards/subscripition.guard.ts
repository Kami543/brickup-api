import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SubscriptionService } from './subscripition.service';
import { SubscriptionStatus, PlanType } from '@prisma/client';

export const REQUIRED_PLAN = 'required_plan';
export const RequirePlan = (plan: PlanType) => SetMetadata(REQUIRED_PLAN, plan);

@Injectable()
export class SubscriptionGuard implements CanActivate {
  private readonly logger = new Logger(SubscriptionGuard.name);

  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPlan = this.reflector.getAllAndOverride<PlanType>(REQUIRED_PLAN, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Usuário não autenticado');
    }

    const organizationId = user.organizationId || user.orgId;

    if (!organizationId) {
      throw new ForbiddenException('Usuário não possui organização');
    }

    try {
      // Busca a assinatura com o plano incluído
      const subscription = await this.subscriptionService.findByOrganizationId(
        organizationId,
      );

      if (!subscription) {
        throw new ForbiddenException('Organização não possui assinatura');
      }

      // Valida status
      if (subscription.status !== SubscriptionStatus.ACTIVE) {
        throw new ForbiddenException(this.getStatusMessage(subscription.status));
      }

      // Valida expiração
      if (subscription.endDate && new Date() > subscription.endDate) {
        await this.subscriptionService.updateSubscription(
          organizationId,
          SubscriptionStatus.EXPIRED,
          subscription.endDate,
        );
        throw new ForbiddenException('Assinatura expirada');
      }

      // Busca o plano (você precisará adicionar um método para isso)
      // Por enquanto, vamos assumir que você tem acesso ao planId
      if (requiredPlan) {
        const plan = await this.getPlanById(subscription.planId);
        if (plan.name !== requiredPlan) {
          throw new ForbiddenException(
            `Este recurso requer o plano ${requiredPlan}`,
          );
        }
      }

      request.subscription = subscription;
      return true;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      
      this.logger.error(
        `Erro ao verificar assinatura da organização ${organizationId}:`,
        error.stack,
      );
      throw new ForbiddenException('Erro ao verificar assinatura');
    }
  }

  private async getPlanById(planId: string) {
    // Implementar busca do plano
    // Por enquanto, retorna um mock
    return { name: PlanType.FREE };
  }

  private getStatusMessage(status: SubscriptionStatus): string {
    const messages = {
      [SubscriptionStatus.ACTIVE]: 'Assinatura ativa',
      [SubscriptionStatus.TRIAL]: 'Período de teste',
      [SubscriptionStatus.CANCELED]: 'Assinatura cancelada',
      [SubscriptionStatus.EXPIRED]: 'Assinatura expirada',
    };
    return messages[status] || 'Assinatura inválida';
  }
}