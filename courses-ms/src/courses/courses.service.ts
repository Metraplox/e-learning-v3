import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { CreateCourseInput } from './dto/inputs/create-course.input';

@Injectable()
export class CoursesService {
    constructor(
        @InjectRepository(Course)
        private courseRepository: Repository<Course>
    ) {}

    async create(createCourseInput: CreateCourseInput): Promise<Course> {
        const course = this.courseRepository.create(createCourseInput);
        return await this.courseRepository.save(course);
    }

    async findAll(): Promise<Course[]> {
        return await this.courseRepository.find();
    }

    async findOne(id: string): Promise<Course> {
        return await this.courseRepository.findOne({
            where: { id }
        });
    }
}