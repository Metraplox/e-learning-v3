import {ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
      @InjectRepository(User)
      private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserInput: CreateUserInput): Promise<User> {
    try {
      // 1. Verificación de usuario existente mejorada
      const existingUser = await this.userRepository.findOne({
        where: [
          { email: createUserInput.email },
          { username: createUserInput.username }
        ]
      });

      if (existingUser) {
        throw new ConflictException(
            existingUser.email === createUserInput.email
                ? 'Email already registered'
                : 'Username already taken'
        );
      }

      // 2. Crear nuevo usuario
      const user = this.userRepository.create(createUserInput);
      return await this.userRepository.save(user);

    } catch (error) {
      // 3. Manejo específico de errores de base de datos
      if (error.code === '23505') {
        throw new ConflictException('User already exists');
      }
      throw error;
    }
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'username', 'email', 'role', 'createdAt', 'updatedAt']
    });

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'username', 'email', 'role', 'createdAt', 'updatedAt']
    });

    if (!user) {
      throw new NotFoundException(`User with email "${email}" not found`);
    }

    return user;
  }

  async update(id: string, updateUserInput: UpdateUserInput): Promise<User> {
    const user = await this.userRepository.preload({
      id: id,
      ...updateUserInput,
    });

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    await this.userRepository.save(user);
    const { password, ...result } = user;
    return result as User;
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.userRepository.delete(id);
    return result.affected > 0;
  }
}
