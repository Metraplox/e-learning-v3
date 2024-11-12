import {Resolver, Query, Mutation, Args, ID} from '@nestjs/graphql';
import {Req, UseGuards} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { Course } from './models/course.model';
import { CreateCourseInput } from './dto/create-course.input';
import { CoursesService } from './courses.service';
import { Enrollment } from './models/enrollment.model';

@Resolver(() => Course)
export class CoursesResolver {
    constructor(private readonly coursesService: CoursesService) {}

    @Query(() => [Course])
    @UseGuards(JwtAuthGuard)
    async courses() {
        return this.coursesService.findAll();
    }

    @Query(() => Course, { name: 'course' })
    async getCourse(@Args('id', { type: () => ID }) id: string) {
        return this.coursesService.findOne(id);
    }

    @Query(() => Course, { name: 'courseDetails' })
    @UseGuards(JwtAuthGuard)
    async getCourseDetails(@Args('id', { type: () => ID }) id: string) {
        return this.coursesService.findOneWithDetails(id);
    }

    @Mutation(() => Course)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('TEACHER')
    async createCourse(
        @Args('createCourseInput') createCourseInput: CreateCourseInput,
        @CurrentUser() user: any
    ) {
        return this.coursesService.create(createCourseInput, user.id);
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