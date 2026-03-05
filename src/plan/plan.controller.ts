import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Logger,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { PlanService } from './plan.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { Plan } from '@prisma/client';
import { PaginationResult } from 'src/common/utils/baseRepository';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { RequireRoles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth 
} from '@nestjs/swagger'; // Opcional, para documentação

@ApiTags('planos')
@ApiBearerAuth()
@Controller('plans') // Renomeado para plural (boa prática)
@UseGuards(AuthGuard, RolesGuard)
export class PlanController {
  private readonly logger = new Logger(PlanController.name);

  constructor(private readonly planService: PlanService) {}

  @ApiOperation({ summary: 'Criar novo plano' })
  @ApiResponse({ status: 201, description: 'Plano criado com sucesso' })
  @ApiResponse({ status: 409, description: 'Plano com este nome já existe' })
  @RequireRoles(Role.OWNER)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createPlan(@Body() data: CreatePlanDto): Promise<Plan> {
    this.logger.log(`Criando novo plano: ${data.name}`);
    return this.planService.createPlan(data);
  }

  @ApiOperation({ summary: 'Listar todos os planos' })
  @ApiResponse({ status: 200, description: 'Lista de planos retornada' })
  @RequireRoles(Role.OWNER)
  @Get()
  async findAllPlans(): Promise<PaginationResult<Plan>> {
    this.logger.log('Buscando todos os planos');
    return this.planService.findAll();
  }

  @ApiOperation({ summary: 'Buscar plano por ID' })
  @ApiResponse({ status: 200, description: 'Plano encontrado' })
  @ApiResponse({ status: 404, description: 'Plano não encontrado' })
  @RequireRoles(Role.OWNER)
  @Get(':id')
  async findPlanById(@Param('id') id: string): Promise<Plan> {
    this.logger.log(`Buscando plano por ID: ${id}`);
    const plan = await this.planService.findById(id);
    
    if (!plan) {
      throw new NotFoundException(`Plano com ID ${id} não encontrado`);
    }
    
    return plan;
  }

  @ApiOperation({ summary: 'Buscar plano por nome' })
  @ApiResponse({ status: 200, description: 'Plano encontrado' })
  @ApiResponse({ status: 404, description: 'Plano não encontrado' })
  @RequireRoles(Role.OWNER)
  @Get('name/:name')
  async findPlanByName(@Param('name') name: string): Promise<Plan> {
    this.logger.log(`Buscando plano por nome: ${name}`);
    const plan = await this.planService.findByName(name);
    
    if (!plan) {
      throw new NotFoundException(`Plano com nome ${name} não encontrado`);
    }
    
    return plan;
  }

  @ApiOperation({ summary: 'Atualizar plano' })
  @ApiResponse({ status: 200, description: 'Plano atualizado' })
  @ApiResponse({ status: 404, description: 'Plano não encontrado' })
  @RequireRoles(Role.OWNER)
  @Put(':id')
  async updatePlan(
    @Param('id') id: string,
    @Body() data: UpdatePlanDto,
  ): Promise<Plan> {
    this.logger.log(`Atualizando plano ID: ${id}`);
    
    // Verifica se o plano existe
    const existingPlan = await this.planService.findById(id);
    if (!existingPlan) {
      throw new NotFoundException(`Plano com ID ${id} não encontrado`);
    }
    
    return this.planService.updatePlan(id, data);
  }

  @ApiOperation({ summary: 'Deletar plano' })
  @ApiResponse({ status: 204, description: 'Plano deletado' })
  @ApiResponse({ status: 404, description: 'Plano não encontrado' })
  @ApiResponse({ status: 409, description: 'Plano possui assinaturas vinculadas' })
  @RequireRoles(Role.OWNER)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePlan(@Param('id') id: string): Promise<void> {
    this.logger.log(`Deletando plano ID: ${id}`);
    
    // Verifica se o plano existe
    const existingPlan = await this.planService.findById(id);
    if (!existingPlan) {
      throw new NotFoundException(`Plano com ID ${id} não encontrado`);
    }
    
    await this.planService.deletePlan(id);
  }
}