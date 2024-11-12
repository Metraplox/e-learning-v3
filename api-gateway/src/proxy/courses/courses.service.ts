import {Inject, Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
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
        try {
            const courseData = {
                ...createCourseInput,
                teacherId: this.getUserId(user),
            };
            return await lastValueFrom(this.coursesClient.send<Course>('courses.create', courseData));
        } catch (error) {
            console.error('Error creating course:', error);
            throw new InternalServerErrorException('Error creating course');
        }
    }

    async findAll(): Promise<Course[]> {
        try {
            return await lastValueFrom(this.coursesClient.send('courses.findAll', {}));
        } catch (error) {
            console.error('Error fetching courses:', error);
            throw new InternalServerErrorException('Error fetching courses');
        }
    }

    async findOne(id: string): Promise<Course> {
        try {
            return await lastValueFrom(this.coursesClient.send('courses.findOne', { id }));
        } catch (error) {
            console.error(`Error fetching course with ID "${id}":`, error);
            throw new NotFoundException(`Course with ID "${id}" not found`);
        }
    }

    async enroll(userId: string, courseId: string): Promise<Enrollment> {
        return lastValueFrom(this.coursesClient.send<Enrollment>('courses.enroll', { userId, courseId }));
    }
}
