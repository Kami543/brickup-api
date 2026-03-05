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
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() data: CreateUserDto): Promise<User> {
    return this.userService.createUser(data);
  }

  @Get()
  async findAll(): Promise<PaginationResult<User>> {
    return this.userService.getAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    return this.userService.getById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateUserDto,
  ): Promise<User> {
    return this.userService.updateUser(id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    await this.userService.deleteUser(id);
  }
}