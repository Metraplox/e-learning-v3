import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { ClientsModuleOptionsFactory, ClientOptions } from '@nestjs/microservices';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

@Injectable()
export abstract class BaseMicroserviceConfig implements ClientsModuleOptionsFactory {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsUrl()
    @IsNotEmpty()
    url: string;

    @IsString()
    @IsNotEmpty()
    queue: string;

    constructor(protected configService: ConfigService) {
        this.loadConfig();
    }

    createClientOptions(): ClientOptions {
        return {
            transport: Transport.RMQ,
            options: {
                urls: [this.url],
                queue: this.queue,
                queueOptions: {
                    durable: true
                },
                noAck: true,
                persistent: true,
                socketOptions: {
                    heartbeatIntervalInSeconds: 60,
                    reconnectTimeInSeconds: 5,
                },
            },
        };
    }

    protected loadConfig(): void {
        this.url = this.configService.get<string>('RABBITMQ_URL', 'amqp://rabbitmq:5672');
        this.queue = this.getQueueName();
    }

    protected abstract getQueueName(): string;
}