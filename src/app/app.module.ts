import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { CommonModule } from 'src/common/common.module';
import { OrganizationModule } from 'src/organization/organization.module';
import { UserModule } from 'src/user/user.module';
import { PlanModule } from 'src/plan/plan.module';
import { SubscriptionModule } from 'src/subscription/subscription.module';
import { LeadModule } from 'src/lead/lead.module';
import { AuthModule } from 'src/auth/auth.module';

import { LoggingInterceptor } from 'src/common/interceptor/logging.interceptor';
import { AuthGuard } from 'src/auth/auth.guard';

@Module({
  imports: [
    CommonModule,
    UserModule,
    PlanModule,
    SubscriptionModule,
    LeadModule,
    OrganizationModule,
    AuthModule,

    //  JWT global
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '15m' },
    }),

    //  Rate limit global
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 100,
    }),
  ],

  controllers: [AppController],

  providers: [
    AppService,

    // Interceptor global
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },

    // Guard global (protege tudo por padrão)
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}