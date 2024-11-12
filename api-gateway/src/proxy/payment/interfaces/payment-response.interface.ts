import { Payment } from '../models/payment.model';

export interface PaymentResponse {
    payment: Payment;
    redirectUrl?: string;
    token?: string;
}