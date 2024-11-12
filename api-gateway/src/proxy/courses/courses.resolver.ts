import {Resolver, Query, Mutation, Args, ID} from '@nestjs/graphql';
import {ForbiddenException, Req, UseGuards} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { Course } from './models/course.model';
import { CreateCourseInput } from './dto/create-course.input';
import { CoursesService } from './courses.service';
import { Enrollment } from './models/enrollment.model';
import {UserRole} from "../users/enums/user-role.enum";

@Resolver(() => Course)
export class CoursesResolver {
    constructor(private readonly coursesService: CoursesService) {}

    @Query(() => [Course], { name: 'courses' })
    @UseGuards(JwtAuthGuard)
    async getCourses(@CurrentUser() user: any) {
        // Verificar permisos del usuario
        if (user.role === UserRole.ADMIN || user.role === UserRole.TEACHER) {
            return this.coursesService.findAll();
        } else {
            throw new ForbiddenException('You do not have permission to view courses');
        }
    }

    @Query(() => Course, { name: 'course' })
    async getCourse(@Args('id', { type: () => ID }) id: string) {
        return this.coursesService.findOne(id);
    }

    @Mutation(() => Course, { name: 'createCourse' })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('TEACHER')
    async createCourse(
        @Args('createCourseInput') createCourseInput: CreateCourseInput,
        @CurrentUser() user: any
    ) {
        // Verificar que el usuario sea un profesor
        if (user.role === UserRole.TEACHER) {
            return this.coursesService.create(createCourseInput, user.id);
        } else {
            throw new ForbiddenException('You do not have permission to create courses');
        }
    }

    @Query(() => [Course], { name: 'availableCourses' })
    async getAvailableCourses() {
        try {
            return await this.coursesService.findAll();
        } catch (error) {
            console.error('Error in getAvailableCourses:', error);
            return [];
        }
    }

    @Mutation(() => Enrollment)
    @UseGuards(JwtAuthGuard)
    async enrollInCourse(
        @Args('courseId') courseId: string,
        @CurrentUser() user: any
    ) {
        return this.coursesService.enroll(user.id, courseId);
    }
}