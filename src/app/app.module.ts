import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from 'src/common/common.module';

import { OrganizationModule } from 'src/organization/organization.module';
import { UserModule } from 'src/user/user.module';
import { PlanModule } from 'src/plan/plan.module';
import { SubscriptionModule } from 'src/subscription/subscription.module';
import { LeadModule } from 'src/lead/lead.module';
import { LoggingInterceptor } from 'src/common/interceptor/logging.interceptor';

@Module({
  imports: [CommonModule,UserModule, PlanModule, SubscriptionModule, LeadModule, OrganizationModule],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: 'APP_INTERCEPTOR',
      useClass: LoggingInterceptor,
    }
  ],
})
export class AppModule {}
