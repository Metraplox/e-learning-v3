import { ConflictException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
      @InjectRepository(User)
      private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserInput: CreateUserInput): Promise<User> {
    try {
      // Verificación de usuario existente mejorada
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

      // Crear nuevo usuario
      const user = this.userRepository.create(createUserInput);
      const savedUser = await this.userRepository.save(user);

      this.logger.log(`User created successfully: ${savedUser.id}`);
      return savedUser;

    } catch (error) {
      this.logger.error(`Error creating user: ${error.message}`, error.stack);

      if (error instanceof ConflictException) {
        throw error;
      }
      if (error.code === '23505') { // PostgreSQL unique violation
        throw new ConflictException('User already exists');
      }

      throw new InternalServerErrorException('Error creating user');
    }
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'username', 'email', 'role', 'createdAt', 'updatedAt']
    });

    if (!user) {
      this.logger.warn(`User not found with ID: ${id}`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'username', 'email', 'role', 'createdAt', 'updatedAt']
    });

    if (!user) {
      this.logger.warn(`User not found with email: ${email}`);
    }

    return user;
  }

  async findByEmailWithPassword(email: string): Promise<User> {
    const user = await this.userRepository
        .createQueryBuilder('user')
        .where('user.email = :email', { email })
        .addSelect('user.password')
        .getOne();

    if (!user) {
      this.logger.warn(`User not found with email: ${email}`);
    }

    return user;
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      select: ['id', 'username', 'email', 'role', 'createdAt', 'updatedAt']
    });
  }

  async update(id: string, updateUserInput: UpdateUserInput): Promise<User> {
    try {
      const user = await this.userRepository.preload({
        id: id,
        ...updateUserInput,
      });

      if (!user) {
        this.logger.warn(`User not found for update with ID: ${id}`);
        return null;
      }

      return await this.userRepository.save(user);
    } catch (error) {
      this.logger.error(`Error updating user: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Error updating user');
    }
  }

  async remove(id: string): Promise<boolean> {
    try {
      const result = await this.userRepository.delete(id);
      return result.affected > 0;
    } catch (error) {
      this.logger.error(`Error removing user: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Error removing user');
    }
  }
}