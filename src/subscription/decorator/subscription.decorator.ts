// subscription.decorator.ts
import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { PlanType } from '@prisma/client';
import { SubscriptionGuard, REQUIRED_PLAN } from './subscription.guard';
import { AuthGuard } from 'src/auth/auth.guard';

export const REQUIRES_SUBSCRIPTION = 'requires_subscription';

export const RequireActiveSubscription = (requiredPlan?: PlanType) => {
  const decorators = [
    UseGuards(AuthGuard, SubscriptionGuard),
  ];

  if (requiredPlan) {
    decorators.push(SetMetadata(REQUIRED_PLAN, requiredPlan));
  }

  return applyDecorators(...decorators);
};