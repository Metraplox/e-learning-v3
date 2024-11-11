import {Resolver, Query, Mutation, Args, Context} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { CreateCourseInput } from './dto/create-course.input';
import { Course } from './models/course.model';
import { CoursesService } from './courses.service';
import {User} from "../users/models/user.model";
import {Enrollment} from "./models/enrollment.model";

@Resolver(() => Course)
export class CoursesResolver {
    constructor(private readonly coursesService: CoursesService) {}

    @Query(() => [Course])
    async courses() {
        return this.coursesService.findAll();
    }

    @Query(() => Course)
    async course(@Args('id') id: string) {
        return this.coursesService.findOne(id);
    }

    @Mutation(() => Course)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('TEACHER')
    async createCourse(
        @Args('createCourseInput') createCourseInput: CreateCourseInput,
        @CurrentUser() user: User,
        @Context() context: any,
    ): Promise<Course>  {
        return this.coursesService.create({
            ...createCourseInput,
            teacherId: user.id,
        },
            context.req.originalToken
        );
    }

    @Mutation(() => Enrollment)
    @UseGuards(JwtAuthGuard)
    async enrollInCourse(
        @Args('courseId') courseId: string,
        @CurrentUser() user: User,
    ): Promise<Enrollment> {
        return this.coursesService.enroll(user.id, courseId);
    }
}