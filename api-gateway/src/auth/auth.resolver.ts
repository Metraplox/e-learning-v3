import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth } from './models/auth.model';
import { LoginInput } from './dto/login.input';
import { CreateUserInput } from '../proxy/users/dto/create-user.input';

@Resolver(() => Auth)
export class AuthResolver {
    constructor(private readonly authService: AuthService) {}

    @Mutation(() => Auth)
    async login(@Args('loginInput') loginInput: LoginInput): Promise<Auth> {
        return this.authService.login(loginInput);
    }

    @Mutation(() => Auth)
    async register(
        @Args('createUserInput') createUserInput: CreateUserInput
    ): Promise<Auth> {
        return this.authService.register(createUserInput);
    }
}