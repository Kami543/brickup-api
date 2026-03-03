// organization.service.ts
import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { OrganizationRepository } from './organization.repository';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/create-organization.dto';
import { Organization } from '@prisma/client';

@Injectable()
export class OrganizationService {
    private readonly logger = new Logger(OrganizationService.name);

    constructor(
        private readonly organizationRepository: OrganizationRepository
    ) {}

    async createOrganization(data: CreateOrganizationDto): Promise<Organization> {
        try {
            this.logger.log(`Criando organização com nome: ${data.name}`);
            
            // Verifica se já existe uma organização com o mesmo slug
            const existingOrg = await this.organizationRepository.findBySlug(data.slug);
            if (existingOrg) {
                throw new BadRequestException('Já existe uma organização com este slug');
            }
            
            const organization = await this.organizationRepository.create(data);
            this.logger.log(`Organização criada com sucesso. ID: ${organization.id}`);
            return organization;
            
        } catch (error) {
            this.logger.error(`Erro ao criar organização: ${error.message}`, error.stack);
            
            if (error instanceof BadRequestException) {
                throw error;
            }
            
            throw new BadRequestException('Erro ao criar organização');
        }
    }

    async findAll() {
        try {
            return await this.organizationRepository.findAll();
        } catch (error) {
            this.logger.error(`Erro ao buscar organizações: ${error.message}`, error.stack);
            throw new BadRequestException('Erro ao buscar organizações');
        }
    }

    async findOne(id: string): Promise<Organization> {
        try {
            const organization = await this.organizationRepository.findById(id);
            
            if (!organization) {
                throw new NotFoundException('Organização não encontrada');
            }
            
            return organization;
        } catch (error) {
            this.logger.error(`Erro ao buscar organização: ${error.message}`, error.stack);
            
            if (error instanceof NotFoundException) {
                throw error;
            }
            
            throw new BadRequestException('Erro ao buscar organização');
        }
    }

    async updateOrganization(id: string, data: UpdateOrganizationDto): Promise<Organization> {
        try {
            this.logger.log(`Atualizando organização com ID: ${id}`);
            
            // Verifica se a organização existe
            const existingOrg = await this.organizationRepository.findById(id);
            if (!existingOrg) {
                throw new NotFoundException('Organização não encontrada');
            }

            // Se estiver atualizando o slug, verifica se o novo slug já existe em outra organização
            if (data.slug && data.slug !== existingOrg.slug) {
                const orgWithSameSlug = await this.organizationRepository.findBySlug(data.slug);
                if (orgWithSameSlug && orgWithSameSlug.id !== id) {
                    throw new BadRequestException('Já existe outra organização com este slug');
                }
            }

            const updatedOrganization = await this.organizationRepository.update(id, data);
            this.logger.log(`Organização atualizada com sucesso. ID: ${updatedOrganization.id}`);
            return updatedOrganization;
            
        } catch (error) {
            this.logger.error(`Erro ao atualizar organização: ${error.message}`, error.stack);
            
            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }
            
            throw new BadRequestException('Erro ao atualizar organização');
        }
    }

    async deleteOrganization(id: string): Promise<Organization> {
        try {
            this.logger.log(`Deletando organização com ID: ${id}`);
            
            // Verifica se a organização existe
            const existingOrg = await this.organizationRepository.findById(id);
            if (!existingOrg) {
                throw new NotFoundException('Organização não encontrada');
            }

            const deletedOrganization = await this.organizationRepository.delete(id);
            this.logger.log(`Organização deletada com sucesso. ID: ${deletedOrganization.id}`);
            return deletedOrganization;
            
        } catch (error) {
            this.logger.error(`Erro ao deletar organização: ${error.message}`, error.stack);
            
            if (error instanceof NotFoundException) {
                throw error;
            }
            
            throw new BadRequestException('Erro ao deletar organização');
        }
    }
}