
import { registerEnumType } from '@nestjs/graphql';

export enum PaymentStatus {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
    CANCELLED = 'CANCELLED',
    REFUNDED = 'REFUNDED',
    PARTIALLY_REFUNDED = 'PARTIALLY_REFUNDED'
}

registerEnumType(PaymentStatus, {
    name: 'PaymentStatus',
    description: 'Estados disponibles para un pago',
});