import {
  Injectable,
  Logger,
  ConflictException,
  NotFoundException
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly userRepository: UserRepository) {}

  // CREATE
  async createUser(data: CreateUserDto): Promise<User> {
    this.logger.log(`Creating user: ${data.email}`);

    const existingUser = await this.userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = await this.userRepository.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role,
      organizationId: data.organizationId,
    });

    return newUser;
  }

  // GET ALL
  async getAll() {
    this.logger.log('Fetching all users');
    return this.userRepository.findAll();
  }

  // GET BY ID
  async getById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  // UPDATE
  async updateUser(id: string, data: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    let hashedPassword: string | undefined;

    if (data.password) {
      hashedPassword = await bcrypt.hash(data.password, 10);
    }

    return this.userRepository.update(id, {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role,
    });
  }

  // DELETE
  async deleteUser(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.delete(id);
  }
}