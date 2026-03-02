import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Logger,
} from '@nestjs/common';

import { PlanService } from './plan.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { Prisma, Plan } from '@prisma/client';
import { PaginationResult  } from 'src/common/utils/baseRepository';

@Controller('plan')
export class PlanController {
  private readonly logger = new Logger(PlanController.name);

  constructor(private readonly planService: PlanService) {}

  // Criar plano
  @Post()
  async createPlan(@Body() data: CreatePlanDto):Promise<Plan> {
    this.logger.log(`Criando plano: ${data.name}`);

    try {
      const result = await this.planService.createPlan(data);

      this.logger.log(`Plano criado com sucesso: ${result.name}`);

      return result;
    } catch (error) {
      this.logger.error(
        `Erro ao criar plano: ${data.name}`,
        error.stack,
      );
      throw error;
    }
  }

  // Listar todos
  @Get()
  async findAllPlans(): Promise<PaginationResult<Plan>> {
    this.logger.log('Requisição para listar todos os planos');
    return this.planService.findAll();
  }

  // Buscar por nome
  @Get('name/:name')
  async findPlanByName(@Param('name') name: any) {
    this.logger.log(`Requisição para buscar plano: ${name}`);
    return this.planService.findByName(name);
  }

  // Atualizar plano
  @Put(':id')
  async updatePlan(
    @Param('id') id: string,
    @Body() data: Prisma.PlanUpdateInput,
  ):Promise<Plan>{
    this.logger.log(`Requisição para atualizar plano: ${id}`);
    return this.planService.updatePlan(id, data);
  }

  // Deletar plano
  @Delete(':id')
  async deletePlan(@Param('id') id: string):Promise<void> {
    this.logger.log(`Requisição para deletar plano: ${id}`);
    return this.planService.deletePlan(id);
  }
}