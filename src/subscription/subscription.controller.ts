import { Get, HttpCode, Logger, Put } from "@nestjs/common";
import { SubscriptionService } from "./subscription.service";
import { Subscription } from "@prisma/client";

@Controller('subscription')
export class SubscriptionController {
  constructor(
    private readonly subscriptionService: SubscriptionService,
  ) {}

  @Post()
  async create(
    @Body() body: { organizationId: string; planId: string },
  ): Promise<Subscription> {
    return this.subscriptionService.createSubscription(
      body.organizationId,
      body.planId,
    );
  }

  @Put(':organizationId')
  async update(
    @Param('organizationId') organizationId: string,
    @Body() body: { status?: string; endDate?: Date },
  ): Promise<Subscription> {
    return this.subscriptionService.updateSubscription(
      organizationId,
      body.status as any,
      body.endDate,
    );
  }

  @Get(':organizationId')
  async findByOrganization(
    @Param('organizationId') organizationId: string,
  ): Promise<Subscription | null> {
    return this.subscriptionService.getSubscriptionByOrganizationId(
      organizationId,
    );
  }

  @Put(':organizationId/cancel')
  async cancel(
    @Param('organizationId') organizationId: string,
  ): Promise<Subscription> {
    return this.subscriptionService.cancelSubscription(
      organizationId,
    );
  }
}