import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentResolver } from './payment.resolver';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Payment} from "./entities/payment.entity";
import {WebPayService} from "./webpay/webpay.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment]),
  ],
  providers: [
    PaymentService,
    WebPayService,
    PaymentResolver
  ],
  exports: [PaymentService]
})
export class PaymentModule {}
