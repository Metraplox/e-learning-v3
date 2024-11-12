import { ConfigService } from '@nestjs/config';
import { ClientsModuleOptions, Transport } from '@nestjs/microservices';

export const getRabbitMQConfig = (configService: ConfigService): ClientsModuleOptions => [
    {
        name: 'USERS_SERVICE',
        transport: Transport.RMQ,
        options: {
            urls: [configService.get<string>('RABBITMQ_URL','amqp://rabbitmq:5672')],
            queue: configService.get<string>('RABBITMQ_QUEUE', 'users_queue'),
            queueOptions: {
                durable: false
            },
        },
    },
    {
        name: 'COURSES_SERVICE',
        transport: Transport.RMQ,
        options: {
            urls: [configService.get<string>('RABBITMQ_URL')],
            queue: configService.get<string>('COURSES_QUEUE', 'courses_queue'),
            queueOptions: {
                durable: false
            },
        },
    },
    {
        name: 'PAYMENTS_SERVICE',
        transport: Transport.RMQ,
        options: {
            urls: [configService.get<string>('RABBITMQ_URL')],
            queue: configService.get<string>('PAYMENTS_QUEUE', 'payments_queue'),
            queueOptions: {
                durable: false
            },
        },
    },
];