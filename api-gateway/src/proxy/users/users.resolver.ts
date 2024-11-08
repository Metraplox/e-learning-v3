import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { UsersService } from './users.service';
import { User } from './models/user.model';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

@Resolver(() => User)
export class UsersResolver {
    constructor(private readonly usersService: UsersService) {}

    @Query(() => [User])
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    async users() {
        return this.usersService.findAll();
    }

    @Query(() => User)
    @UseGuards(JwtAuthGuard)
    async user(@Args('id') id: string) {
        return this.usersService.findOne(id);
    }

    @Query(() => User)
    @UseGuards(JwtAuthGuard)
    async me(@CurrentUser() user: any) {
        return this.usersService.findOne(user.id);
    }

    @Mutation(() => User)
    async createUser(
        @Args('createUserInput') createUserInput: CreateUserInput
    ) {
        return this.usersService.create(createUserInput);
    }

    @Mutation(() => User)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    async updateUser(
        @Args('updateUserInput') updateUserInput: UpdateUserInput,
        @CurrentUser() user: any,
    ) {
        return this.usersService.update(updateUserInput.id, updateUserInput);
    }

    @Mutation(() => Boolean)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    async removeUser(
        @Args('id') id: string,
        @CurrentUser() user: any,
    ) {
        return this.usersService.remove(id);
    }
}