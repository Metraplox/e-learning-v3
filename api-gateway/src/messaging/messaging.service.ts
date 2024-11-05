import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class MessagingService {
    constructor(
        @Inject('RABBITMQ_CLIENT')
        private readonly client: ClientProxy,
    ) {}

    async sendCommand(pattern: string, data: any): Promise<any> {
        try {
            const response = await lastValueFrom(
                this.client.send(pattern, data)
            );
            return response;
        } catch (error) {
            throw new Error(`Error sending command ${pattern}: ${error.message}`);
        }
    }

    async emit(pattern: string, data: any): Promise<void> {
        try {
            await this.client.emit(pattern, data).toPromise();
        } catch (error) {
            throw new Error(`Error emitting event ${pattern}: ${error.message}`);
        }
    }
}