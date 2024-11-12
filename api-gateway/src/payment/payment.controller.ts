// src/payment/payment.controller.ts

import { Controller, Post, Body, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Controller('payment')
export class PaymentController {
  constructor(@Inject('PAYMENT_SERVICE') private readonly paymentService: ClientProxy) {}

  @Post('transaction')
  createTransaction(@Body('amount') amount: number): Observable<any> {
    // Envía un mensaje al microservicio de pagos usando RabbitMQ
    return this.paymentService.send({ cmd: 'create-transaction' }, amount);
  }

  @Post('confirm')
  confirmTransaction(@Body('token') token: string): Observable<any> {
    // Envía un mensaje al microservicio de pagos para confirmar la transacción
    return this.paymentService.send({ cmd: 'confirm-transaction' }, token);
  }
}
