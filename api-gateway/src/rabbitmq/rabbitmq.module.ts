import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
    imports: [ConfigModule],
    providers: [
        {
            provide: 'USERS_SERVICE',
            useFactory: (configService: ConfigService) => ({
                transport: Transport.RMQ,
                options: {
                    urls: [configService.get<string>('USERS_RABBITMQ_URL')],
                    queue: configService.get<string>('USERS_RABBITMQ_QUEUE'),
                    queueOptions: {
                        durable: false,
                    },
                },
            }),
            inject: [ConfigService],
        },
        {
            provide: 'COURSES_SERVICE',
            useFactory: (configService: ConfigService) => ({
                transport: Transport.RMQ,
                options: {
                    urls: [configService.get<string>('COURSES_RABBITMQ_URL')],
                    queue: configService.get<string>('COURSES_RABBITMQ_QUEUE'),
                    queueOptions: {
                        durable: false,
                    },
                },
            }),
            inject: [ConfigService],
        },
        {
            provide: 'PAYMENTS_SERVICE',
            useFactory: (configService: ConfigService) => ({
                transport: Transport.RMQ,
                options: {
                    urls: [configService.get<string>('PAYMENTS_RABBITMQ_URL')],
                    queue: configService.get<string>('PAYMENTS_RABBITMQ_QUEUE'),
                    queueOptions: {
                        durable: false,
                    },
                },
            }),
            inject: [ConfigService],
        },
    ],
    exports: ['USERS_SERVICE', 'COURSES_SERVICE', 'PAYMENTS_SERVICE'],
})
export class RabbitMQModule {}