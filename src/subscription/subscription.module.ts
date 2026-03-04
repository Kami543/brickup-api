import { Module } from "@nestjs/common";
import { SubscriptionController } from "./subscription.controller";

@Module({
    imports: [PrismaModule],
    controllers: [SubscriptionController],
    providers: [SubscriptionService,SubscriptionRepository],
})
export class SubscriptionModule {}