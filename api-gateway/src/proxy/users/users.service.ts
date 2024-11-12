import {Inject, Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './models/user.model';
import {firstValueFrom, lastValueFrom} from 'rxjs';

@Injectable()
export class UsersService {
    constructor(
        @Inject('USERS_SERVICE') private readonly usersClient: ClientProxy
    ) {}

    async onModuleInit() {
        await this.usersClient.connect();
    }

    async create(createUserInput: CreateUserInput): Promise<User> {
        try {
            return await firstValueFrom(
                this.usersClient.send('users.create', createUserInput)
            );
        } catch (error) {
            throw new InternalServerErrorException(`Error creating user: ${error.message}`);
        }
    }

    async findAll(): Promise<User[]> {
        try {
            const response = await lastValueFrom(
                this.usersClient.send<User[]>('users.findAll', {})
            );
            return response;
        } catch (error) {
            throw new InternalServerErrorException(`Error fetching users: ${error.message}`);
        }
    }

    async findOne(id: string): Promise<User> {
        try {
            return await firstValueFrom(
                this.usersClient.send('users.findOne', { id })
            );
        } catch (error) {
            throw new NotFoundException(`User with ID "${id}" not found`);
        }
    }

    async findByEmail(email: string): Promise<User> {
        try {
            const response = await lastValueFrom(
                this.usersClient.send<User>('users.findByEmail', { email })
            );
            return response;
        } catch (error) {
            throw new InternalServerErrorException(`Error fetching user by email: ${error.message}`);
        }
    }

    async update(id: string, updateUserInput: UpdateUserInput): Promise<User> {
        try {
            const response = await lastValueFrom(
                this.usersClient.send<User>('users.update', { id, updateUserInput })
            );
            return response;
        } catch (error) {
            throw new InternalServerErrorException(`Error updating user: ${error.message}`);
        }
    }

    async remove(id: string): Promise<boolean> {
        try {
            const response = await lastValueFrom(
                this.usersClient.send<boolean>('users.remove', { id })
            );
            return response;
        } catch (error) {
            throw new InternalServerErrorException(`Error removing user: ${error.message}`);
        }
    }

    async onApplicationShutdown() {
        await this.usersClient.close();
    }
}