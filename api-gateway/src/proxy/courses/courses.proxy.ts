import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { BaseProxy } from '../shared/base.proxy';
import { Course } from './models/course.model';
import { CreateCourseInput } from './dto/create-course.input';
import { UpdateCourseInput } from './dto/update-course.input';
import { PaginatedCourses } from './interfaces/paginated-courses.interface';
import { Enrollment } from './models/enrollment.model';
import { CourseRating } from './models/course-rating.model';

@Injectable()
export class CoursesProxy extends BaseProxy<Course> {
    constructor(
        @Inject('COURSES_SERVICE') client: ClientProxy
    ) {
        super(client, {
            CREATE: 'courses.create',
            FIND_ALL: 'courses.findAll',
            FIND_ONE: 'courses.findOne',
            UPDATE: 'courses.update',
            DELETE: 'courses.remove',
            ENROLL: 'courses.enroll',
            RATE: 'courses.rate',
            GET_ENROLLED: 'courses.getEnrolled',
            GET_MY_COURSES: 'courses.getMyCourses',
            GET_TEACHER_COURSES: 'courses.getTeacherCourses',
            UPDATE_STATUS: 'courses.updateStatus',
            ADD_LESSON: 'courses.addLesson',
            REMOVE_LESSON: 'courses.removeLesson',
            GET_COURSE_STATS: 'courses.getStats'
        });
    }

    async create(input: CreateCourseInput): Promise<Course> {
        return this.send<Course>('CREATE', input);
    }

    async findAll(options: any): Promise<PaginatedCourses> {
        return this.send<PaginatedCourses>('FIND_ALL', options);
    }

    async findOne(id: string): Promise<Course> {
        return this.sendWithRetry<Course>('FIND_ONE', { id });
    }

    async update(id: string, input: UpdateCourseInput): Promise<Course> {
        return this.send('UPDATE', { id, ...input });
    }

    async remove(id: string): Promise<boolean> {
        return this.send('DELETE', { id });
    }

    async enroll(params: { courseId: string; userId: string }): Promise<Enrollment> {
        return this.send<Enrollment>('ENROLL', params);
    }

    async rate(params: { courseId: string; userId: string; rating: number }): Promise<CourseRating> {
        return this.send<CourseRating>('RATE', params);
    }

    async getMyCourses(userId: string, options: {
        page?: number;
        limit?: number;
        status?: string;
    }): Promise<PaginatedCourses> {
        return this.send('GET_MY_COURSES', { userId, ...options });
    }

    async getTeacherCourses(teacherId: string, options: {
        page?: number;
        limit?: number;
        status?: string;
    }): Promise<PaginatedCourses> {
        return this.send('GET_TEACHER_COURSES', { teacherId, ...options });
    }

    async updateStatus(id: string, status: string): Promise<Course> {
        return this.send('UPDATE_STATUS', { id, status });
    }

    async getCourseStats(courseId: string): Promise<any> {
        return this.send('GET_COURSE_STATS', { courseId });
    }

    onCourseUpdated(courseId: string) {
        return this.emit('COURSE_UPDATED', { courseId });
    }

    onEnrollmentUpdated(enrollmentId: string) {
        return this.emit('ENROLLMENT_UPDATED', { enrollmentId });
    }
}