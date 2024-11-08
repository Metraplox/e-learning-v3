import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { LoginInput } from './dto/login.input';
import { User } from '../proxy/users/models/user.model';
import { lastValueFrom } from 'rxjs';
import * as bcrypt from 'bcrypt';
import {CreateUserInput} from "../proxy/users/dto/create-user.input";

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        @Inject('USERS_SERVICE') private readonly usersServiceClient: ClientProxy, // Cliente del microservicio de usuarios
    ) {}

    async login(loginInput: LoginInput): Promise<string> {
        const { email, password } = loginInput;

        const user = await lastValueFrom(
            this.usersServiceClient.send<User>({ cmd: 'find-user-by-email' }, email)
        );

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        return this.generateToken(user);
    }

    async register(userInput: CreateUserInput): Promise<User> {
        const hashedPassword = await bcrypt.hash(userInput.password, 10);

        // Enviar solicitud para crear un nuevo usuario
        const newUser = await lastValueFrom(
            this.usersServiceClient.send<User>({ cmd: 'create-user' }, {
                ...userInput,
                password: hashedPassword
            })
        );

        return newUser;
    }

    async validateUser(userId: string): Promise<User> {
        // Solicitar usuario al servicio de usuarios por ID
        const user = await lastValueFrom(
            this.usersServiceClient.send<User>({ cmd: 'find-user-by-id' }, userId)
        );

        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        return user;
    }

    private generateToken(user: User): string {
        const payload = { sub: user.id, email: user.email, role: user.role };
        return this.jwtService.sign(payload);
    }
}
