import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersProxy } from './users/users.proxy';
import { CoursesProxy } from './courses/courses.proxy';
import { PaymentsProxy } from './payment/payments.proxy';
import { CoursesModule } from './courses/courses.module';
import { MicroservicesModule } from '../microservices/microservices.module';

@Module({
    imports: [
        ConfigModule,
        MicroservicesModule,
        CoursesModule,
    ],
    providers: [UsersProxy, CoursesProxy, PaymentsProxy],
    exports: [UsersProxy, CoursesProxy, PaymentsProxy, CoursesModule],
})
export class ProxyModule {}