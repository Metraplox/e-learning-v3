import {Inject, Injectable} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { CreateCourseInput } from './dto/create-course.input';
import { Course } from './models/course.model';
import {Enrollment} from "./models/enrollment.model";

@Injectable()
export class CoursesService {
    constructor(
        @Inject('COURSES_SERVICE')
        private readonly coursesClient: ClientProxy
    ) {}

    async create(createCourseInput: CreateCourseInput, token: string): Promise<Course> {
        return lastValueFrom(
            this.coursesClient.send<Course>('courses.create', {
                ...createCourseInput,
                metadata: {
                    token
                }
            })
        );
    }

    async findAll(): Promise<Course[]> {
        return lastValueFrom(
            this.coursesClient.send('courses.findAll', {})
        );
    }

    async findOne(id: string): Promise<Course>  {
        return lastValueFrom(
            this.coursesClient.send('courses.findOne', { id })
        );
    }

    async enroll(userId: string, courseId: string): Promise<Enrollment> {
        return lastValueFrom(
            this.coursesClient.send<Enrollment>('courses.enroll', { userId, courseId }),
        );
    }
}