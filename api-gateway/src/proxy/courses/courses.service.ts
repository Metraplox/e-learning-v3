import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {firstValueFrom, lastValueFrom} from 'rxjs';
import { CreateCourseInput } from './dto/create-course.input';
import { Course } from './models/course.model';
import { Enrollment } from './models/enrollment.model';

@Injectable()
export class CoursesService {
    constructor(
        @Inject('COURSES_SERVICE') private readonly coursesClient: ClientProxy
    ) {}

    private getUserId(user: any): string {
        return user.sub || user.id; // Obtener el ID del usuario del token JWT
    }

    async create(createCourseInput: CreateCourseInput, user: any): Promise<Course> {
        const courseData = {
            ...createCourseInput,
            teacherId: this.getUserId(user)
        };

        return lastValueFrom(this.coursesClient.send<Course>('courses.create', courseData));
    }

    async findAll(): Promise<Course[]> {
        return lastValueFrom(this.coursesClient.send<Course[]>('courses.findAll', {}));
    }

    async findOne(id: string): Promise<Course> {
        return lastValueFrom(this.coursesClient.send('courses.findOne', { id }));
    }

    async enroll(userId: string, courseId: string): Promise<Enrollment> {
        return lastValueFrom(this.coursesClient.send<Enrollment>('courses.enroll', { userId, courseId }));
    }
}
