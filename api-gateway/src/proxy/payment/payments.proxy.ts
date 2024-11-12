
import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { BaseProxy } from '../shared/base.proxy';
import { Payment } from './models/payment.model';
import { CreatePaymentInput } from './dto/create-payment.input';
import { PaginatedPayments } from './interfaces/paginated-payments.interface';
import { PaymentStatus } from './enums/payment-status.enum';

@Injectable()
export class PaymentsProxy extends BaseProxy<Payment> {
    constructor(
        @Inject('PAYMENTS_SERVICE') client: ClientProxy
    ) {
        super(client, {
            CREATE: 'payments.create',
            FIND_ALL: 'payments.findAll',
            FIND_ONE: 'payments.findOne',
            PROCESS: 'payments.process',
            CONFIRM: 'payments.confirm',
            CANCEL: 'payments.cancel',
            REFUND: 'payments.refund',
            GET_USER_PAYMENTS: 'payments.getUserPayments',
            GET_PAYMENT_STATS: 'payments.getStats',
            VERIFY_PAYMENT: 'payments.verify',
            UPDATE_STATUS: 'payments.updateStatus'
        });
    }

    async create(input: CreatePaymentInput): Promise<Payment> {
        return this.send<Payment>('CREATE', input);
    }

    async findAll(options: {
        page?: number;
        limit?: number;
        status?: PaymentStatus;
        fromDate?: Date;
        toDate?: Date;
        userId?: string;
    }): Promise<PaginatedPayments> {
        return this.send<PaginatedPayments>('FIND_ALL', options);
    }

    async findOne(id: string): Promise<Payment> {
        return this.sendWithRetry<Payment>('FIND_ONE', { id });
    }

    async processPayment(params: {
        paymentId: string;
        paymentMethodId: string;
        amount: number;
    }): Promise<Payment> {
        return this.send('PROCESS', params);
    }

    async confirmPayment(token: string): Promise<Payment> {
        return this.send('CONFIRM', { token });
    }

    async cancelPayment(id: string, reason?: string): Promise<boolean> {
        return this.send('CANCEL', { id, reason });
    }

    async refundPayment(id: string, amount?: number): Promise<Payment> {
        return this.send('REFUND', { id, amount });
    }

    async getUserPayments(
        userId: string,
        options: {
            page?: number;
            limit?: number;
            status?: PaymentStatus;
            fromDate?: Date;
            toDate?: Date;
        }
    ): Promise<PaginatedPayments> {
        return this.send('GET_USER_PAYMENTS', { userId, ...options });
    }

    async getPaymentStats(params: {
        fromDate: Date;
        toDate: Date;
        groupBy?: string;
    }): Promise<any> {
        return this.send('GET_PAYMENT_STATS', params);
    }

    async verifyPayment(paymentId: string): Promise<boolean> {
        return this.send('VERIFY_PAYMENT', { paymentId });
    }

    async updateStatus(params: {
        paymentId: string;
        status: PaymentStatus;
        metadata?: any;
    }): Promise<Payment> {
        return this.send('UPDATE_STATUS', params);
    }

    onPaymentStatusUpdated(paymentId: string) {
        return this.emit('PAYMENT_STATUS_UPDATED', { paymentId });
    }

    onPaymentRefunded(paymentId: string) {
        return this.emit('PAYMENT_REFUNDED', { paymentId });
    }
}