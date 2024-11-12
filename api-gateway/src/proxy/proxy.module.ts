import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {ClientsModule, Transport} from '@nestjs/microservices';
import { getRabbitMQConfig } from '../config/rabbitmq.config';
import { UsersProxy } from './users/users.proxy';
import { CoursesProxy } from './courses/courses.proxy';
import { PaymentsProxy } from './payment/payments.proxy';
import {CoursesModule} from "./courses/courses.module";

@Module({
    imports: [
        ClientsModule.registerAsync([
            {
                name: 'USERS_SERVICE',
                imports: [ConfigModule],
                useFactory: async (configService: ConfigService) => ({
                    transport: Transport.RMQ,
                    options: {
                        urls: [configService.get<string>('RABBITMQ_URL')],
                        queue: configService.get<string>('RABBITMQ_QUEUE'),
                        queueOptions: {
                            durable: false
                        },
                    },
                }),
                inject: [ConfigService],
            },
            {
                name: 'COURSES_SERVICE',
                imports: [ConfigModule],
                useFactory: async (configService: ConfigService) => ({
                    transport: Transport.RMQ,
                    options: {
                        urls: [configService.get<string>('RABBITMQ_URL')],
                        queue: configService.get<string>('COURSES_QUEUE'),
                        queueOptions: {
                            durable: false
                        },
                    },
                }),
                inject: [ConfigService],
            },
            {
                name: 'PAYMENTS_SERVICE',
                imports: [ConfigModule],
                useFactory: async (configService: ConfigService) => ({
                    transport: Transport.RMQ,
                    options: {
                        urls: [configService.get<string>('RABBITMQ_URL')],
                        queue: configService.get<string>('PAYMENTS_QUEUE'),
                        queueOptions: {
                            durable: false
                        },
                    },
                }),
                inject: [ConfigService],
            },
        ]),
        ConfigModule,
        CoursesModule,
    ],
    providers: [
        UsersProxy,
        CoursesProxy,
        PaymentsProxy,
    ],
    exports: [
        ClientsModule,
        UsersProxy,
        CoursesProxy,
        PaymentsProxy,
        CoursesModule,
    ],
})
export class ProxyModule {}