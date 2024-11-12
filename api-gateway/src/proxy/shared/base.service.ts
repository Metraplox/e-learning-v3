import { Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class BaseService {
    constructor(private readonly client: ClientProxy) {}

    protected send<T>(pattern: string, data: any): Promise<T> {
        return this.client.send<T>(pattern, data).toPromise();
    }
}