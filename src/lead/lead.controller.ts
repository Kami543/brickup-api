import { Controller, Get, Post, Body, Param, Delete, Put, Logger, HttpCode } from '@nestjs/common';
import { LeadService } from './lead.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';

@Controller('lead')
export class LeadController {
  private readonly logger = new Logger(LeadController.name);

  constructor(private readonly leadService: LeadService) { }

  @Post()
  @HttpCode(201)
  async createLead(@Body() data: CreateLeadDto) {
    this.logger.log(`Criando lead com email: ${data.email}`);
    return this.leadService.createLead(data);
  }

  @Get()
  async findAll() {
    this.logger.log('Buscando todos os leads');
    return this.leadService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    this.logger.log(`Buscando lead com id: ${id}`);
    return this.leadService.findById(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdateLeadDto) {
    this.logger.log(`Atualizando lead com id: ${id}`);
    return this.leadService.updateLead(id, data);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    this.logger.log(`Deletando lead com id: ${id}`);
    await this.leadService.deleteLead(id);
  }
}