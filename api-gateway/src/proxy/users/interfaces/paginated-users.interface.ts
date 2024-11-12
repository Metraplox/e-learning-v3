import { User } from '../models/user.model';
import { PaginatedResponse } from '../../shared/interfaces/pagination.interface';

export interface PaginatedUsers extends PaginatedResponse<User> {}