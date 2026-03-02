import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Delete
  } from '@nestjs/common';
  import { UserService } from './user.service';
  import { CreateUserDto } from './dto/create-user.dto';
  import { UpdateUserDto } from './dto/update-user.dto';
  import { User } from '@prisma/client';
import { PaginationResult } from 'src/common/utils/baseRepository';
  
  @Controller('users')
  export class UserController {
    constructor(private readonly userService: UserService) {}
  
    // CREATE
    @Post()
    async create(@Body() dados: CreateUserDto): Promise<User> {
      return this.userService.createUser(dados);
    }
  
    // GET ALL
    @Get()
    async findAll(): Promise<PaginationResult<User>> {
      return this.userService.getAll();
    }
  
    // GET BY ID
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<User> {
      return this.userService.getById(id);
    }
  
    // UPDATE COMPLETO (PUT)
    @Put(':id')
    async update(
      @Param('id') id: string,
      @Body() dados: UpdateUserDto
    ): Promise<User> {
      return this.userService.updateUser(id, dados);
    }
  
    // DELETE REAL
    @Delete(':id')
    async remove(@Param('id') id: string): Promise<void> {
      return this.userService.deleteUser(id);
    }
  }