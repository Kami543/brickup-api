import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/create-organization.dto';

@Controller('organization')
export class OrganizationController {
  private readonly logger = new Logger(OrganizationController.name);
  
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
  async create(@Body() createOrganizationDto: CreateOrganizationDto) {
    this.logger.log(`Criando organização: ${createOrganizationDto.name}`);
    const result = await this.organizationService.createOrganization(createOrganizationDto);
    return {
      success: true,
      data: result,
      message: 'Organização criada com sucesso'
    };
  }

  @Get()
  async findAll() {
    this.logger.log('Listando todas as organizações');
    const result = await this.organizationService.findAll();
    return {
      success: true,
      data: result,
      message: 'Organizações listadas com sucesso'
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    this.logger.log(`Buscando organização: ${id}`);
    const result = await this.organizationService.findOne(id);
    return {
      success: true,
      data: result,
      message: 'Organização encontrada com sucesso'
    };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto
  ) {
    this.logger.log(`Atualizando organização: ${id}`);
    const result = await this.organizationService.updateOrganization(id, updateOrganizationDto);
    return {
      success: true,
      data: result,
      message: 'Organização atualizada com sucesso'
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    this.logger.log(`Deletando organização: ${id}`);
    await this.organizationService.deleteOrganization(id);
  }
}