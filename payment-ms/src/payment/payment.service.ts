import { Injectable } from '@nestjs/common';
import { CreatePaymentInput } from './dto/create-payment.input';
import { UpdatePaymentInput } from './dto/update-payment.input';
import {PaymentStatus} from "./enums/payment-status.enum";
import {InjectRepository} from "@nestjs/typeorm";
import {Payment} from "./entities/payment.entity";
import {Repository} from "typeorm";
import {WebPayService} from "./webpay/webpay.service";

// src/payment/payment.service.ts
@Injectable()
export class PaymentService {
  constructor(
      @InjectRepository(Payment)
      private paymentRepository: Repository<Payment>,
      private webpayService: WebPayService
  ) {}

  async createPayment(courseId: string, userId: string, amount: number): Promise<Payment> {
    // 1. Crear registro de pago
    const payment = this.paymentRepository.create({
      courseId,
      userId,
      amount,
      status: PaymentStatus.PENDING
    });

    await this.paymentRepository.save(payment);

    // 2. Iniciar transacción WebPay
    try {
      const webpayResponse = await this.webpayService.createTransaction(
          amount,
          payment.id
      );

      // 3. Actualizar con token WebPay
      payment.webpayToken = webpayResponse.token;
      payment.status = PaymentStatus.PROCESSING;

      return this.paymentRepository.save(payment);
    } catch (error) {
      payment.status = PaymentStatus.FAILED;
      await this.paymentRepository.save(payment);
      throw error;
    }
  }

    async findAll() {
        return this.paymentRepository.find();
    }

    async findOne(id: any) {
        return this.paymentRepository.findOne(id);
    }

    async update(id: string, updatePaymentInput: UpdatePaymentInput) {
        return `This action updates a #${id} payment`;
    }

    async remove(id: string) {
        return `This action removes a #${id} payment`;
    }
}
