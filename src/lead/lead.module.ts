import { Module } from '@nestjs/common';
import { LeadService } from './lead.service';
import { LeadController } from './lead.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { LeadRepository } from './lead.repository';

@Module({
  imports: [PrismaModule],
  controllers: [LeadController],
  providers: [LeadService, LeadRepository],
})
export class LeadModule {}
