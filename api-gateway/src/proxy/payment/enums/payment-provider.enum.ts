import { registerEnumType } from '@nestjs/graphql';

export enum PaymentProvider {
    WEBPAY = 'WEBPAY',
    STRIPE = 'STRIPE',
    PAYPAL = 'PAYPAL'
}

registerEnumType(PaymentProvider, {
    name: 'PaymentProvider',
    description: 'Proveedores de pago disponibles',
});