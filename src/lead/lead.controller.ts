import { Controller, Get, Post, Body, Param, Delete, Put, Logger, HttpCode } from '@nestjs/common';
import { LeadService } from './lead.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';

@Controller('lead')
export class LeadController {
  constructor(private readonly leadService: LeadService) {}

  @Post()
  @HttpCode(201)
  async createLead(@Body() data: CreateLeadDto) {
    return this.leadService.createLead(data);
  }

  @Get()
  async findAll() {
    return this.leadService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.leadService.findById(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdateLeadDto) {
    return this.leadService.updateLead(id, data);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    await this.leadService.deleteLead(id);
  }
}