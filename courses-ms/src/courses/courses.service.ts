import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import {EnrollCourseInput} from "./dto/inputs/enroll-course.input";
import {CreateCourseInput} from "./dto/inputs/create-course.input";
import {UpdateCourseInput} from "./dto/inputs/update-course.input";
import { Enrollment } from './entities/enrollment.entity';
import { CourseRating } from './entities/course-rating.entity';

@Injectable()
export class CoursesService {
    constructor(
        @InjectRepository(Course)
        private courseRepository: Repository<Course>,
        @InjectRepository(Enrollment)
        private enrollmentRepository: Repository<Enrollment>,
        @InjectRepository(CourseRating)
        private ratingRepository: Repository<CourseRating>
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

    async findOneWithLessons(id: string): Promise<Course> {
        const course = await this.courseRepository.findOne({
            where: { id },
            relations: ['lessons', 'enrollments', 'enrollments.user'],
        });

        if (!course) {
            throw new NotFoundException(`Course with ID "${id}" not found`);
        }

        return course;
    }

    async rate(data: { courseId: string; userId: string; rating: number }): Promise<CourseRating> {
        // 1. Verificar que el curso existe
        const course = await this.courseRepository.findOne({
            where: { id: data.courseId }
        });

        if (!course) {
            throw new NotFoundException(`Course with ID ${data.courseId} not found`);
        }

        // 2. Verificar si el usuario ya calificó este curso
        let existingRating = await this.ratingRepository.findOne({
            where: {
                userId: data.userId,
                courseId: data.courseId
            }
        });

        if (existingRating) {
            // Actualizar calificación existente
            existingRating.rating = data.rating;
            await this.ratingRepository.save(existingRating);
        } else {
            // Crear nueva calificación
            existingRating = this.ratingRepository.create({
                userId: data.userId,
                courseId: data.courseId,
                rating: data.rating
            });
            await this.ratingRepository.save(existingRating);
        }

        // 3. Actualizar promedio de calificaciones del curso
        const ratings = await this.ratingRepository.find({
            where: { courseId: data.courseId }
        });

        course.averageRating = ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length;
        course.totalRatings = ratings.length;

        await this.courseRepository.save(course);

        return existingRating;
    }
}