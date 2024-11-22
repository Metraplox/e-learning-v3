import { Injectable } from '@nestjs/common';
import { BaseMicroserviceConfig } from './base-microservice.config';
import { ConfigService } from '@nestjs/config';
import { IsIn, IsNotEmpty, IsString, IsUrl } from 'class-validator';

@Injectable()
export class PaymentsServiceConfig extends BaseMicroserviceConfig {
    @IsString()
    @IsNotEmpty()
    name = 'PAYMENTS_SERVICE';

    @IsString()
    @IsUrl()
    @IsNotEmpty()
    url: string;

    @IsString()
    @IsNotEmpty()
    queue: string;

    @IsIn(['development', 'production'])
    environment: string;

    constructor(configService: ConfigService) {
        super(configService);
        this.loadConfig();
    }

    protected getQueueName(): string {
        return this.configService.get<string>('PAYMENTS_QUEUE', 'payments_queue');
    }

    protected loadConfig(): void {
        this.url = this.configService.get<string>('RABBITMQ_URL', 'amqp://rabbitmq:5672');
        this.queue = this.getQueueName();
        this.environment = this.configService.get<string>('NODE_ENV', 'development');
    }
}