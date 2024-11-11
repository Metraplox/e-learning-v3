import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import {UnauthorizedException, UseGuards} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { UsersService } from './users.service';
import { User } from './models/user.model';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { CreateGoogleUserInput } from './dto/create-google-user.input';
import {UserRole} from "./enums/user-role.enum";

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
      const existingUser = await this.usersService.findByEmail(createUserInput.email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }
      return this.usersService.create(createUserInput);
    }
  
    @Query(() => User, { nullable: true })
    async checkUser(@Args('email') email: string): Promise<User | null> {
      return this.usersService.findByEmail(email);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Mutation(() => User)
    async updateUser(
        @Args('updateUserInput') updateUserInput: UpdateUserInput,
        @CurrentUser() currentUser: User
    ) {
        // El usuario está intentando actualizar su propio perfil?
        if (updateUserInput.id !== currentUser.id && currentUser.role !== UserRole.ADMIN) {
            throw new UnauthorizedException('You can only update your own profile');
        }

        // No permitir cambio de rol excepto para ADMIN
        if (updateUserInput.role && currentUser.role !== UserRole.ADMIN) {
            delete updateUserInput.role;
        }

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

    @Query(() => User)
    @UseGuards(JwtAuthGuard) 
    async getUserProfile(@Context() context): Promise<User> {
      const userId = context.req.user.id; // Obtiene el ID del usuario desde el token JWT
      return this.usersService.findOne(userId);
    }

    @Mutation(() => User)
    async createGoogleUser(
        @Args('createGoogleUserInput') createGoogleUserInput: CreateGoogleUserInput
    ): Promise<User> {
        // Verifica si el usuario ya existe por email
        const existingUser = await this.usersService.findByEmail(createGoogleUserInput.email);
        
        if (existingUser) {
            return existingUser; // Devuelve el usuario existente si ya está en la base de datos
        }
        
        // Si no existe, procede a crear un nuevo usuario
        return this.usersService.createGoogleUser(createGoogleUserInput);
    }


}