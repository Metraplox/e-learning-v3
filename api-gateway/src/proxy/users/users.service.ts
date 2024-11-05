import { Injectable } from '@nestjs/common';
import { MessagingService } from '../../messaging/messaging.service';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './models/user.model';

@Injectable()
export class UsersService {
    constructor(private readonly messagingService: MessagingService) {}

    async create(createUserInput: CreateUserInput): Promise<User> {
        // Aquí implementaremos la lógica para crear usuario a través del microservicio
        return this.messagingService.sendCommand('create_user', createUserInput);
    }

    async findAll(): Promise<User[]> {
        // Aquí implementaremos la lógica para obtener usuarios del microservicio
        return this.messagingService.sendCommand('find_all_users', {});
    }

    async findOne(id: string): Promise<User> {
        // Aquí implementaremos la lógica para obtener un usuario del microservicio
        return this.messagingService.sendCommand('find_one_user', { id });
    }

    async update(updateUserInput: UpdateUserInput): Promise<User> {
        // Aquí implementaremos la lógica para actualizar usuario a través del microservicio
        return this.messagingService.sendCommand('update_user', updateUserInput);
    }

    async remove(id: string): Promise<boolean> {
        // Aquí implementaremos la lógica para eliminar usuario a través del microservicio
        return this.messagingService.sendCommand('remove_user', { id });
    }
}