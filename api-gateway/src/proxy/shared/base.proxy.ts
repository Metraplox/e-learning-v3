import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, Observable } from 'rxjs';

export abstract class BaseProxy<T = any> {
    constructor(
        protected readonly client: ClientProxy,
        protected readonly patterns: Record<string, string>
    ) {}

    protected async send<R = T>(pattern: string, data: any): Promise<R> {
        return firstValueFrom(this.client.send<R>(this.patterns[pattern], data));
    }

    protected async sendWithRetry<R = T>(pattern: string, data: any, retries = 3): Promise<R> {
        let attempt = 0;
        let result: R | null = null;
        while (attempt < retries) {
            try {
                result = await this.send<R>(pattern, data);
                break;
            } catch (error) {
                if (++attempt >= retries) this.handleError(error);
            }
        }
        return result;
    }

    protected emit(pattern: string, data: any): void {
        this.client.emit(this.patterns[pattern], data);
    }

    protected handleError(error: any): never {
        throw new Error(`Request failed: ${error.message}`);
    }
}