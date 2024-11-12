import { Payment } from '../models/payment.model';
import { PaginatedResponse } from '../../shared/interfaces/pagination.interface';

export interface PaginatedPayments extends PaginatedResponse<Payment> {}