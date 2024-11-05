// import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
// import { UseGuards } from '@nestjs/common';
// import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
// import { CoursesService } from './courses.service';
// import { Course } from './models/course.model';
//
// @Resolver(() => Course)
// export class CoursesResolver {
//     constructor(private readonly coursesService: CoursesService) {}
//
//     @Query(() => [Course])
//     @UseGuards(JwtAuthGuard)
//     async courses() {
//         return this.coursesService.findAll();
//     }
//
//     // Implementar más queries y mutations según necesidades
// }
