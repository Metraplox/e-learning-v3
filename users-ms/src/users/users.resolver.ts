import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { ParseUUIDPipe } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.usersService.create(createUserInput);
  }

  @Query(() => [User], { name: 'users' })
  async findAll() {
    return this.usersService.findAll();
  }

  @Query(() => User, { name: 'user' })
  async findOne(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Query(() => User, { name: 'userByEmail' })
  async findByEmail(@Args('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  // RabbitMQ Message Patterns para comunicación entre servicios
  @MessagePattern('users.findAll')
  async findAllUsers() {
    return this.usersService.findAll();
  }

  @MessagePattern('users.findOne')
  async findOneUser(data: { id: string }) {
    return this.usersService.findOne(data.id);
  }

  @MessagePattern('users.create')
  async createUserMessage(createUserInput: CreateUserInput) {
    return this.usersService.create(createUserInput);
  }

  @MessagePattern('users.update')
  async updateUser(data: { id: string, updateUserInput: UpdateUserInput }) {
    return this.usersService.update(data.id, data.updateUserInput);
  }

  @MessagePattern('users.remove')
  async removeUser(data: { id: string }) {
    return this.usersService.remove(data.id);
  }

}
