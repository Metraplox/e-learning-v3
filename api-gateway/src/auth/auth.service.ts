import { Injectable, Inject, UnauthorizedException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserInput } from "../proxy/users/dto/create-user.input";
import { firstValueFrom } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
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
                })
            );

            if (!user) throw new UnauthorizedException('User not found');
            if (!user.password) throw new UnauthorizedException('Invalid password');

            // Verificar password
            const isPasswordValid = await bcrypt.compare(
                loginInput.password,
                user.password
            );

            if (!isPasswordValid) {
                throw new UnauthorizedException('Incorrect password');
            }

            // Generar token
            const token = this.generateToken(user);

            // Eliminar password de la respuesta
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
            // 1. Hash del password antes de enviarlo al microservicio
            const hashedPassword = await bcrypt.hash(createUserInput.password, 10);

            // 2. Crear usuario directamente - el microservicio manejará la validación de existencia
            const newUser = await firstValueFrom(
                this.usersServiceClient.send('users.create', {
                    ...createUserInput,
                    password: hashedPassword
                }).pipe(
                    map(user => {
                        if (!user) throw new InternalServerErrorException('User creation failed');
                        return user;
                    }),
                    catchError(error => {
                        if (error?.status === 409) {
                            throw new BadRequestException(error.message || 'User already exists');
                        }
                        throw new InternalServerErrorException('Registration failed - Please try again');
                    })
                )
            );

            // 3. Generar token JWT
            const token = this.generateToken(newUser);

            // 4. Eliminar password de la respuesta
            const { password, ...userWithoutPassword } = newUser;

            // 5. Retornar respuesta formateada
            return {
                token,
                user: userWithoutPassword
            };

        } catch (error) {
            if (error instanceof BadRequestException ||
                error instanceof UnauthorizedException) {
                throw error;
            }

            console.error('Registration error:', {
                message: error.message,
                code: error.code,
                status: error.status
            });

            throw new InternalServerErrorException(
                'Registration service temporarily unavailable'
            );
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
            throw new InternalServerErrorException('Token generation failed');
        }

    }

}