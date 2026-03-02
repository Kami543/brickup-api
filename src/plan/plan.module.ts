import { Module } from '@nestjs/common';
import { PlanService } from './plan.service';
import { PlanController } from './plan.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PlanRepository } from './plan.repository';

@Module({
  imports: [PrismaModule],
  controllers: [PlanController],
  providers: [PlanService,PlanRepository],
})
export class PlanModule {}
