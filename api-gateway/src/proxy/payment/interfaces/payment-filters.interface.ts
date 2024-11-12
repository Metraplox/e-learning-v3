import { PaymentStatus } from '../enums/payment-status.enum';

export interface PaymentFilters {
    page?: number;
    limit?: number;
    status?: PaymentStatus;
    fromDate?: Date;
    toDate?: Date;
    userId?: string;
    courseId?: string;
    provider?: string;
    minAmount?: number;
    maxAmount?: number;
}