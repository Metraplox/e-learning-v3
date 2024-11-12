import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { BaseProxy } from '../shared/base.proxy';
import { User } from './models/user.model';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { PaginatedUsers } from './interfaces/paginated-users.interface';

@Injectable()
export class UsersProxy extends BaseProxy<User> {
    constructor(
        @Inject('USERS_SERVICE') client: ClientProxy
    ) {
        super(client, {
            CREATE: 'users.create',
            FIND_ALL: 'users.findAll',
            FIND_ONE: 'users.findOne',
            UPDATE: 'users.update',
            DELETE: 'users.delete',
        });
    }

    async create(input: CreateUserInput): Promise<User> {
        return this.send<User>('CREATE', input);
    }

    async findAll(options: {
        page?: number;
        limit?: number;
        role?: string;
    }): Promise<PaginatedUsers> {
        return this.send<PaginatedUsers>('FIND_ALL', options);
    }

    async findOne(id: string): Promise<User> {
        return this.send<User>('FIND_ONE', { id });
    }

    async update(id: string, input: UpdateUserInput): Promise<User> {
        return this.send('UPDATE', { id, ...input });
    }

    async findByEmail(email: string): Promise<User> {
        return this.send<User>('FIND_BY_EMAIL', { email });
    }

    async validateUser(token: string): Promise<User> {
        return this.send('VALIDATE', { token });
    }

    async changePassword(
        userId: string,
        oldPassword: string,
        newPassword: string
    ): Promise<boolean> {
        return this.send('CHANGE_PASSWORD', {
            userId,
            oldPassword,
            newPassword,
        });
    }
}