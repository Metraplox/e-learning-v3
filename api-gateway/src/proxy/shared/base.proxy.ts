import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Logger } from '@nestjs/common';

export abstract class BaseProxy<T = any> {
    protected readonly logger = new Logger(this.constructor.name);

    constructor(
        protected readonly client: ClientProxy,
        protected readonly serviceName: string,
        protected readonly patterns: Record<string, string>
    ) {}

    protected async send<R = T>(pattern: string, data: any): Promise<R> {
        try {
            this.logger.debug(`Sending to ${this.serviceName}: ${pattern}`);
            const response = await firstValueFrom(
                this.client.send<R>(this.patterns[pattern], data)
            );
            return response;
        } catch (error) {
            this.logger.error(
                `Error in ${this.serviceName} - ${pattern}:`,
                error.message
            );
            throw error;
        }
    }

    protected async sendWithRetry<R = T>(
        pattern: string,
        data: any
    ): Promise<R> {
        const retries = 3;
        const delay = 1000;
        let lastError: any;

        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                return await this.send<R>(pattern, data);
            } catch (error) {
                lastError = error;
                this.logger.warn(
                    `Retry ${attempt}/${retries} for ${pattern} in ${this.serviceName}`
                );
                if (attempt < retries) {
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }
        throw lastError;
    }
}