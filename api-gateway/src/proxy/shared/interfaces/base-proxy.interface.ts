import { Observable } from 'rxjs';

export interface IBaseProxy<T = any> {
    send<R = T>(pattern: string, data: any): Promise<R>;
    emit<R = T>(pattern: string, data: any): Observable<R>;
    sendWithRetry<R = T>(pattern: string, data: any, retries?: number): Promise<R>;
    handleError(error: any): never;
}