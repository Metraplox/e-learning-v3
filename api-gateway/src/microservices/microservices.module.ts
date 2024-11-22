import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { BaseMicroserviceConfig } from '../microservices/base-microservice.config';
import { UsersServiceConfig } from '../microservices/users-service.config';
import { CoursesServiceConfig } from '../microservices/courses-service.config';
import { PaymentsServiceConfig } from '../microservices/payments-service.config';

@Module({
    imports: [
        ClientsModule.registerAsync([
            {
                name: 'USERS_SERVICE',
                useClass: UsersServiceConfig,
                inject: [ConfigService],
            },
            {
                name: 'COURSES_SERVICE',
                useClass: CoursesServiceConfig,
                inject: [ConfigService],
            },
            {
                name: 'PAYMENTS_SERVICE',
                useClass: PaymentsServiceConfig,
                inject: [ConfigService],
            },
        ]),
    ],
    exports: [ClientsModule],
})
export class MicroservicesModule {}