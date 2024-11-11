import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './models/user.model';
import { lastValueFrom } from 'rxjs';
import { CreateGoogleUserInput } from './dto/create-google-user.input';
import { UserRole } from './enums/user-role.enum';

@Injectable()
export class UsersService {
    private client: ClientProxy;

    constructor(private readonly configService: ConfigService) {
        this.client = ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
                urls: [this.configService.get<string>('RABBITMQ_URL')],
                queue: this.configService.get<string>('RABBITMQ_QUEUE') || 'users_queue',
                queueOptions: {
                    durable: false
                },
            },
        });
    }

    async onModuleInit() {
        await this.client.connect();
    }

    async create(createUserInput: CreateUserInput): Promise<User> {
        try {
            const response = await lastValueFrom(
                this.client.send<User>('users.create', createUserInput)
            );

            if (!response) {
                throw new InternalServerErrorException('Failed to create user');
            }

            return response;
        } catch (error) {
            throw new InternalServerErrorException(
                `Error creating user: ${error.message || 'Unknown error'}`
            );
        }
    }

    async findAll(): Promise<User[]> {
        try {
            const response = await lastValueFrom(
                this.client.send<User[]>('users.findAll', {})
            );
            return response;
        } catch (error) {
            throw new InternalServerErrorException(`Error fetching users: ${error.message}`);
        }
    }

    async findOne(id: string): Promise<User> {
        try {
            const response = await lastValueFrom(
                this.client.send<User>('users.findOne', { id })
            );
            return response;
        } catch (error) {
            throw new InternalServerErrorException(`Error fetching user: ${error.message}`);
        }
    }

    async findByEmail(email: string): Promise<User> {
        try {
            const response = await lastValueFrom(
                this.client.send<User>('users.findByEmail', { email })
            );
            return response;
        } catch (error) {
            throw new InternalServerErrorException(`Error fetching user by email: ${error.message}`);
        }
    }

    async update(id: string, updateUserInput: UpdateUserInput): Promise<User> {
        try {
            const response = await lastValueFrom(
                this.client.send<User>('users.update', { id, updateUserInput })
            );
            return response;
        } catch (error) {
            throw new InternalServerErrorException(`Error updating user: ${error.message}`);
        }
    }

    async remove(id: string): Promise<boolean> {
        try {
            const response = await lastValueFrom(
                this.client.send<boolean>('users.remove', { id })
            );
            return response;
        } catch (error) {
            throw new InternalServerErrorException(`Error removing user: ${error.message}`);
        }
    }

    async onApplicationShutdown() {
        await this.client.close();
    }

    async createGoogleUser(createGoogleUserInput: CreateGoogleUserInput): Promise<User> {
        const { email, username, role } = createGoogleUserInput;

        // Verifica si el usuario ya existe con ese correo
        const existingUser = await this.findByEmail(email);
        if (existingUser) {
            return existingUser; // Si el usuario ya existe, retorna el usuario existente
        }

        // Configurar una contraseña predeterminada para usuarios de Google
        const createUserInput: CreateUserInput = {
            email,
            username,
            role: role || UserRole.STUDENT,
            password: 'default-google-password', // Contraseña predeterminada
        };

        return this.create(createUserInput); // Reutiliza el método `create`
    }
}