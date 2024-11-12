// courses-ms/src/courses/courses.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { Enrollment } from './entities/enrollment.entity';
import {EnrollCourseInput} from "./dto/inputs/enroll-course.input";
import {CreateCourseInput} from "./dto/inputs/create-course.input";
import {CourseStatus} from "./enums/course-status.enum";
import {UpdateCourseInput} from "./dto/inputs/update-course.input";

@Injectable()
export class CoursesService {
    constructor(
        @InjectRepository(Course)
        private courseRepository: Repository<Course>,
        @InjectRepository(Enrollment)
        private enrollmentRepository: Repository<Enrollment>,
    ) {}

    async create(createCourseInput: CreateCourseInput & { teacherId: string }): Promise<Course> {
        const course = this.courseRepository.create(createCourseInput);
        return await this.courseRepository.save(course);
    }

    async findAll(): Promise<Course[]> {
        return await this.courseRepository.find({
        });
    }

    async findOne(id: string): Promise<Course> {
        const course = await this.courseRepository.findOne({ where: { id } });
        if (!course) {
            throw new NotFoundException(`Course with ID "${id}" not found`);
        }
        return course;
    }

    async enroll(enrollCourseInput: EnrollCourseInput): Promise<Enrollment> {
        const enrollment = this.enrollmentRepository.create(enrollCourseInput);
        return await this.enrollmentRepository.save(enrollment);
    }

    async getUserCourses(userId: string): Promise<string[]> {
        const enrollments = await this.enrollmentRepository.find({
            where: { userId },
            relations: ['course'],
        });
        return enrollments.map(enrollment => enrollment.courseId);
    }

    remove(id: number) {

    }

    update(updateCourseInput: UpdateCourseInput) {

    }
}