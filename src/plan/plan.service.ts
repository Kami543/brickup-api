import {
    Injectable,
    ConflictException,
    NotFoundException,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';

import { Plan, PlanType, Prisma } from '@prisma/client';
import { CreatePlanDto } from './dto/create-plan.dto';
import { PlanRepository } from './plan.repository';

@Injectable()
export class PlanService {
    private readonly logger = new Logger(PlanService.name);

    constructor(private readonly planRepository: PlanRepository) {}

    // Criar plano
    async createPlan(data: CreatePlanDto): Promise<Plan> {
        this.logger.log(`Tentando criar plano: ${data.name}`);

        try {
            const existing = await this.planRepository.findByName(data.name);

            if (existing) {
                this.logger.warn(`Plano já existe: ${data.name}`);
                throw new ConflictException('Esse plano já existe.');
            }

            const plan = await this.planRepository.create(data);

            this.logger.log(`Plano criado com sucesso: ${plan.name}`);

            return plan;
        } catch (error) {
            this.logger.error(`Erro ao criar plano: ${data.name}`, error.stack);
            throw error;
        }
    }

    // Listar todos
    async findAll() {
        this.logger.log('Listando todos os planos');
        return this.planRepository.findAll();
    }

    // Buscar por nome
    async findByName(name: PlanType): Promise<Plan> {
        this.logger.log(`Buscando plano por nome: ${name}`);

        const plan = await this.planRepository.findByName(name);

        if (!plan) {
            this.logger.warn(`Plano não encontrado: ${name}`);
            throw new NotFoundException('Plano não encontrado.');
        }

        return plan;
    }

    // Buscar plano da organização
    async findPlanByOrganization(organizationId: string): Promise<Plan> {
        this.logger.log(`Buscando plano da organização: ${organizationId}`);

        const plan = await this.planRepository.findByOrganizationId(organizationId);

        if (!plan) {
            this.logger.warn(`Plano não encontrado para organização: ${organizationId}`);
            throw new NotFoundException('Plano da organização não encontrado.');
        }

        return plan;
    }

    // Atualizar plano
    async updatePlan(
        id: string,
        data: Prisma.PlanUpdateInput,
    ): Promise<Plan> {
        this.logger.log(`Atualizando plano: ${id}`);

        const existing = await this.planRepository.findById(id);

        if (!existing) {
            this.logger.warn(`Tentativa de atualizar plano inexistente: ${id}`);
            throw new NotFoundException('Plano não encontrado.');
        }

        const updated = await this.planRepository.update(id, data);

        this.logger.log(`Plano atualizado com sucesso: ${id}`);

        return updated;
    }

    // Deletar plano
    async deletePlan(id: string): Promise<void> {
        this.logger.log(`Deletando plano: ${id}`);

        const existing = await this.planRepository.findById(id);

        if (!existing) {
            this.logger.warn(`Tentativa de deletar plano inexistente: ${id}`);
            throw new NotFoundException('Plano não encontrado.');
        }

        await this.planRepository.delete(id);

        this.logger.log(`Plano deletado com sucesso: ${id}`);
    }
}