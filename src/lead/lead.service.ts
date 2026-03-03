import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { LeadRepository } from './lead.repository';
import { Lead } from '@prisma/client';

@Injectable()
export class LeadService {
  private readonly logger = new Logger(LeadService.name)
  constructor(private readonly leadRepository: LeadRepository) {}

  async createLead(data: CreateLeadDto) :Promise<Lead> {
    this.logger.log(`Criando lead com email: ${data.email}`);
    const existing = await this.leadRepository.findByEmail(data.email);
    if (existing) {
      this.logger.warn(`Lead já existe com email: ${data.email}`);
      throw new ConflictException('Lead com esse email já existe.');
    }
    return this.leadRepository.create(data);
  }

  async findAllByOrganizationId(organizationId: string): Promise<Lead[]> {
    this.logger.log(`Buscando leads para organização: ${organizationId}`);
    return this.leadRepository.findByOrganizationId(organizationId);
  }

  async findByEmail(email: string): Promise<Lead> {
    this.logger.log(`Buscando lead por email: ${email}`);
    const lead = await this.leadRepository.findByEmail(email);
    if (!lead) {
      this.logger.warn(`Lead não encontrado com email: ${email}`);
      throw new NotFoundException('Lead não encontrado.');
    }
    return lead;
  }

  async updateLead(id: string, data: UpdateLeadDto): Promise<Lead> {
    this.logger.log(`Atualizando lead com id: ${id}`);
    const existing = await this.leadRepository.findById(id);
    if (!existing) {
      this.logger.warn(`Lead não encontrado com id: ${id}`);
      throw new NotFoundException('Lead não encontrado.');
    }
    return this.leadRepository.update(id, data);
  }

  async deleteLead(id: string): Promise<void> {
    this.logger.log(`Deletando lead com id: ${id}`);
    const existing = await this.leadRepository.findById(id);
    if (!existing) {
      this.logger.warn(`Lead não encontrado para deletar com id: ${id}`);
      throw new NotFoundException('Lead não encontrado.');
    }
    await this.leadRepository.delete(id);
  }

  async findById(id: string): Promise<Lead> {
    this.logger.log(`Buscando lead por id: ${id}`);
    const lead = await this.leadRepository.findById(id);
    if (!lead) {
      this.logger.warn(`Lead não encontrado com id: ${id}`);
      throw new NotFoundException('Lead não encontrado.');
    }
    return lead;
  }

  async findAll(){
    this.logger.log('Buscando todos os leads');
    return this.leadRepository.findAll();
  }
}
