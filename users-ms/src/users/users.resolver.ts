import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import {MessagePattern, Payload, RpcException} from '@nestjs/microservices';
import {ConflictException, Controller} from '@nestjs/common';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { CreateGoogleUserInput } from './dto/create-google-user.input';

@Controller()
@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern('users.create')
  async create(@Payload() createUserInput: CreateUserInput): Promise<User> {
    try {
      return await this.usersService.create(createUserInput);
    } catch (error) {
      if (error instanceof ConflictException) {
        // Propagar error con estado específico para el gateway
        throw new RpcException({
          status: 409,
          message: error.message
        });
      }
      throw new RpcException('User creation failed');
    }
  }

  @MessagePattern('users.findByEmailWithPassword')
  async findByEmailWithPassword(@Payload() data: { email: string }): Promise<User> {
    const user = await this.usersService.findByEmailWithPassword(data.email);
    if (!user) {
      throw new RpcException('User not found');
    }
    return user;
  }

  @Query(() => [User], { name: 'users' })
  findAllGraphQL() {
    return this.usersService.findAll();
  }

  @MessagePattern('users.findAll')
  findAll() {
    return this.usersService.findAll();
  }

  @Query(() => User, { name: 'user' })
  findOneGraphQL(@Args('id', { type: () => ID }) id: string) {
    return this.usersService.findOne(id);
  }

  @MessagePattern('users.findOne')
  findOne(@Payload() data: { id: string }) {
    return this.usersService.findOne(data.id);
  }

  @MessagePattern('users.findByEmail')
  async findByEmail(@Payload() data: { email: string }): Promise<User> {
    return this.usersService.findByEmail(data.email);
  }

  @Mutation(() => User)
  createUserGraphQL(
      @Args('createUserInput') createUserInput: CreateUserInput,
  ) {
    return this.usersService.create(createUserInput);
  }

  @Mutation(() => User)
  updateUserGraphQL(
      @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ) {
    return this.usersService.update(updateUserInput.id, updateUserInput);
  }

  @MessagePattern('users.update')
  update(@Payload() payload: { id: string; updateUserInput: UpdateUserInput }) {
    return this.usersService.update(payload.id, payload.updateUserInput);
  }

  @Mutation(() => Boolean)
  removeUserGraphQL(@Args('id', { type: () => ID }) id: string) {
    return this.usersService.remove(id);
  }

  @MessagePattern('users.remove')
  remove(@Payload() data: { id: string }) {
    return this.usersService.remove(data.id);
  }

  @MessagePattern('users.createGoogleUser')
    async createGoogleUser(@Payload() createGoogleUserInput: CreateGoogleUserInput) {
        return this.usersService.createGoogleUser(createGoogleUserInput);
    }
}