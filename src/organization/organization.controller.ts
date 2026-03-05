import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/create-organization.dto';

@Controller('organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
  async create(@Body() dto: CreateOrganizationDto) {
    return this.organizationService.createOrganization(dto);
  }

  @Get()
  async findAll() {
    return this.organizationService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.organizationService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateOrganizationDto,
  ) {
    return this.organizationService.updateOrganization(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string) {
    await this.organizationService.deleteOrganization(id);
  }
}