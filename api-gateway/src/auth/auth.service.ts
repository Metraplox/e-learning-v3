import { Injectable, Inject, UnauthorizedException, InternalServerErrorException, BadRequestException, RequestTimeoutException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserInput } from "../proxy/users/dto/create-user.input";
import { firstValueFrom } from 'rxjs';
import { timeout, catchError } from 'rxjs/operators';
import * as bcrypt from 'bcrypt';
import { LoginInput } from './dto/login.input';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        @Inject('USERS_SERVICE') private readonly usersServiceClient: ClientProxy,
    ) {}

    async login(loginInput: LoginInput) {
        try {
            const user = await firstValueFrom(
                this.usersServiceClient.send('users.findByEmailWithPassword', {
                    email: loginInput.email
                }).pipe(
                    timeout(15000)
                )
            );

            if (!user) throw new UnauthorizedException('User not found');
            if (!user.password) throw new UnauthorizedException('Invalid password');

            const isPasswordValid = await bcrypt.compare(
                loginInput.password,
                user.password
            );

            if (!isPasswordValid) {
                throw new UnauthorizedException('Incorrect password');
            }

            const token = this.generateToken(user);
            const { password, ...userWithoutPassword } = user;

            return {
                token,
                user: userWithoutPassword
            };

        } catch (error) {
            if (error instanceof UnauthorizedException) {
                throw error;
            }
            throw new InternalServerErrorException('Login failed - Please try again');
        }
    }

    async register(createUserInput: CreateUserInput) {
        try {
            const hashedPassword = await bcrypt.hash(createUserInput.password, 10);

            const newUser = await firstValueFrom(
                this.usersServiceClient.send('users.create', {
                    ...createUserInput,
                    password: hashedPassword
                }).pipe(
                    timeout(15000)
                )
            );

            if (!newUser) {
                throw new InternalServerErrorException('User creation failed');
            }

            const token = this.generateToken(newUser);
            const { password, ...userWithoutPassword } = newUser;

            return {
                token,
                user: userWithoutPassword
            };

        } catch (error) {
            if (error.name === 'TimeoutError') {
                throw new RequestTimeoutException('Registration request timed out - please try again');
            }

            console.error('Registration error:', {
                name: error.name,
                message: error.message,
                status: error.status
            });

            if (error instanceof BadRequestException) {
                throw error;
            }
            if (error?.status === 409) {
                throw new BadRequestException(error.message || 'User already exists');
            }

            throw new InternalServerErrorException('Registration failed - Please try again');
        }
    }

    private generateToken(user: any): string {
        try {
            return this.jwtService.sign({
                sub: user.id,
                email: user.email,
                role: user.role,
                username: user.username
            });
        } catch (error) {
            console.error('Token generation error:', error);
            throw new InternalServerErrorException('Token generation failed');
        }
    }
}