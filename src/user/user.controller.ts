import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Delete,
    Logger
  } from '@nestjs/common';
  import { UserService } from './user.service';
  import { CreateUserDto } from './dto/create-user.dto';
  import { UpdateUserDto } from './dto/update-user.dto';
  import { User } from '@prisma/client';
import { PaginationResult } from 'src/common/utils/baseRepository';
  
  @Controller('users')
  export class UserController {
    private readonly logger = new Logger(UserController.name);

    constructor(private readonly userService: UserService) {}
  
    @Post()
    async create(@Body() data: CreateUserDto): Promise<User> {
      this.logger.log(`Criando novo usuário: ${JSON.stringify(data)}`);
      try {
        const result = await this.userService.createUser(data);
        this.logger.log(`Usuário criado com sucesso: ${result.id}`);
        return result;
      } catch (error) {
        this.logger.error(`Erro ao criar usuário: ${error.message}`, error.stack);
        throw error;
      }
    }
  
    @Get()
    async findAll(): Promise<PaginationResult<User>> {
      this.logger.log('Buscando todos os usuários');
      try {
        const result = await this.userService.getAll();
        this.logger.log(`Total de usuários encontrados: ${result.total}`);
        return result;
      } catch (error) {
        this.logger.error(`Erro ao buscar usuários: ${error.message}`, error.stack);
        throw error;
      }
    }
  
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<User> {
      this.logger.log(`Buscando usuário por ID: ${id}`);
      try {
        const result = await this.userService.getById(id);
        this.logger.log(`Usuário encontrado: ${result.id}`);
        return result;
      } catch (error) {
        this.logger.error(`Erro ao buscar usuário ${id}: ${error.message}`, error.stack);
        throw error;
      }
    }
  
   
    @Put(':id')
    async update(
      @Param('id') id: string,
      @Body() data: UpdateUserDto
    ): Promise<User> {
      this.logger.log(`Atualizando usuário ${id} com dados: ${JSON.stringify(data)}`);
      try {
        const result = await this.userService.updateUser(id, data);
        this.logger.log(`Usuário ${id} atualizado com sucesso`);
        return result;
      } catch (error) {
        this.logger.error(`Erro ao atualizar usuário ${id}: ${error.message}`, error.stack);
        throw error;
      }
    }
  
    @Delete(':id')
    async remove(@Param('id') id: string): Promise<void> {
      this.logger.log(`Removendo usuário: ${id}`);
      try {
        await this.userService.deleteUser(id);
        this.logger.log(`Usuário ${id} removido com sucesso`);
      } catch (error) {
        this.logger.error(`Erro ao remover usuário ${id}: ${error.message}`, error.stack);
        throw error;
      }
    }
  }