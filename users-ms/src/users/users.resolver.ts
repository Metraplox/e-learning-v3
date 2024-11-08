import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

@Controller()
@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

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
  findByEmail(@Payload() data: { email: string }) {
    return this.usersService.findByEmail(data.email);
  }

  @Mutation(() => User)
  createUserGraphQL(
      @Args('createUserInput') createUserInput: CreateUserInput,
  ) {
    return this.usersService.create(createUserInput);
  }

  @MessagePattern('users.create')
  create(@Payload() createUserInput: CreateUserInput) {
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
}