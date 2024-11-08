//auth.resolver.ts
import {Args, Mutation, Resolver} from '@nestjs/graphql';
import {AuthService} from './auth.service';
import {LoginInput} from './dto/login.input';
import {User} from '../proxy/users/models/user.model';
import {CreateUserInput} from "../proxy/users/dto/create-user.input";

@Resolver(() => User)
export class AuthResolver {
    constructor(private readonly authService: AuthService) {}

    @Mutation(() => String)
    async login(@Args('loginInput') loginInput: LoginInput) {
        return this.authService.login(loginInput);
    }

    @Mutation(() => User)
    async register(@Args('registerInput') registerInput: CreateUserInput) {
        return this.authService.register(registerInput);
    }

    @Mutation(() => User)
    async validateUser(@Args('id') id: string) {
        return this.authService.validateUser(id);
    }
}


