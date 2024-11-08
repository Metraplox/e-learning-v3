import { Injectable, Logger } from '@nestjs/common';
import { WebPay, WebPayResponse } from 'webpay-nodejs';

@Injectable()
export class WebPayService {
    private webpay: any;
    private readonly logger = new Logger(WebPayService.name);

    constructor() {
        this.webpay = new WebPay({
            commerceCode: '597055555532',  // Sandbox
            apiKey: '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C',
            environment: 'integration'
        });
    }

    async createTransaction(amount: number, orderId: string): Promise<WebPayResponse> {
        try {
            const result = await this.webpay.transactions.create(
                amount,
                orderId,
                {
                    returnUrl: 'http://localhost:3000/payment/callback'
                }
            );

            this.logger.log(`Transaction created: ${orderId}`);
            return result;
        } catch (error) {
            this.logger.error(`WebPay Error: ${error.message}`);
            throw new Error('Error creating transaction');
        }
    }
}