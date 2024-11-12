import { Course } from '../models/course.model';
import { PaginatedResponse } from '../../shared/interfaces/pagination.interface';

export interface PaginatedCourses extends PaginatedResponse<Course> {}