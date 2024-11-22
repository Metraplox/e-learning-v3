import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { BaseProxy } from '../shared/base.proxy';
import { User } from './models/user.model';
import { CreateUserInput } from './dto/create-user.input';

const USER_MESSAGE_PATTERNS = {
    CREATE: 'users.create',
    FIND_ALL: 'users.findAll',
    FIND_ONE: 'users.findOne',
    FIND_BY_EMAIL: 'users.findByEmail',
    UPDATE: 'users.update',
    DELETE: 'users.remove',
    VALIDATE: 'users.validate'
} as const;

@Injectable()
export class UsersProxy extends BaseProxy<User> {
    constructor(
        @Inject('USERS_SERVICE') client: ClientProxy
    ) {
        super(client, 'USERS_SERVICE', USER_MESSAGE_PATTERNS);
    }

    async create(input: CreateUserInput): Promise<User> {
        return this.sendWithRetry<User>('CREATE', input);
    }

    async findByEmail(email: string): Promise<User> {
        return this.send<User>('FIND_BY_EMAIL', { email });
    }

    async validate(token: string): Promise<User> {
        return this.send<User>('VALIDATE', { token });
    }

    async findAll(): Promise<User[]> {
        return this.send<User[]>('FIND_ALL', {});
    }
}