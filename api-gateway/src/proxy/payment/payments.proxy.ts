
import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { BaseProxy } from '../shared/base.proxy';
import { Payment } from './models/payment.model';
import { CreatePaymentInput } from './dto/create-payment.input';
import { PaginatedPayments } from './interfaces/paginated-payments.interface';
import { PaymentStatus } from './enums/payment-status.enum';
import {lastValueFrom} from "rxjs";

@Injectable()
@Injectable()
export class PaymentsProxy {
    constructor(
        @Inject('PAYMENTS_SERVICE') private readonly paymentsClient: ClientProxy
    ) {}

    async createPayment(input: CreatePaymentInput): Promise<Payment> {
        return lastValueFrom(
            this.paymentsClient.send<Payment>('payments.create', input)
        );
    }

    async findAll(options: {
        page?: number;
        limit?: number;
        status?: PaymentStatus;
        fromDate?: Date;
        toDate?: Date;
        userId?: string;
    }): Promise<PaginatedPayments> {
        return lastValueFrom(
            this.paymentsClient.send<PaginatedPayments>('payments.findAll', options)
        );
    }

    async findOne(id: string): Promise<Payment> {
        return lastValueFrom(
            this.paymentsClient.send<Payment>('payments.findOne', { id })
        );
    }

    async processPayment(params: {
        paymentId: string;
        paymentMethodId: string;
        amount: number;
    }): Promise<Payment> {
        return lastValueFrom(
            this.paymentsClient.send<Payment>('PROCESS', params)
        );
    }

    // async confirmPayment(token: string): Promise<Payment> {
    //     return lastValueFrom(
    //         this.paymentsClient.send<Payment>('CONFIRM', { token })
    //     );
    // }
    //
    // async refundPayment(id: string, amount?: number): Promise<Payment> {
    //     return this.paymentsClient.send<Payment>('REFUND', { id, amount });
    // }
    //
    // async getUserPayments(
    //     userId: string,
    //     options: {
    //         page?: number;
    //         limit?: number;
    //         status?: PaymentStatus;
    //         fromDate?: Date;
    //         toDate?: Date;
    //     }
    // ): Promise<PaginatedPayments> {
    //     return this.paymentsClient.send<Payment>('GET_USER_PAYMENTS', { userId, ...options });
    // }
    //
    // async getPaymentStats(params: {
    //     fromDate: Date;
    //     toDate: Date;
    //     groupBy?: string;
    // }): Promise<any> {
    //     return this.paymentsClient.send<Payment>('GET_PAYMENT_STATS', params);
    // }
    //
    // async verifyPayment(paymentId: string): Promise<boolean> {
    //     return this.paymentsClient.send<Payment>('VERIFY_PAYMENT', { paymentId });
    // }
    //
    // async updateStatus(params: {
    //     paymentId: string;
    //     status: PaymentStatus;
    //     metadata?: any;
    // }): Promise<Payment> {
    //     return this.paymentsClient.send<Payment>('UPDATE_STATUS', params);
    // }
    //
    // onPaymentStatusUpdated(paymentId: string) {
    //     return this.paymentsClient.send<Payment>('PAYMENT_STATUS_UPDATED', { paymentId });
    // }
    //
    // onPaymentRefunded(paymentId: string) {
    //     return this.paymentsClient.send<Payment>('PAYMENT_REFUNDED', { paymentId });
    // }
}