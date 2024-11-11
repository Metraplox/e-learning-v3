import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { CoursesModule } from './courses/courses.module';
import { PaymentModule } from './payment/payment.module';
import { PaymentResolver } from './payment/payment.resolver';
import {CoursesService} from "./courses/courses.service";
import {CoursesResolver} from "./courses/courses.resolver";

@Module({
  imports: [
      UsersModule,
      CoursesModule,
      PaymentModule,
  ],
  providers: [PaymentResolver, CoursesService, CoursesResolver],
  exports: [CoursesService],
})
export class ProxyModule {}
