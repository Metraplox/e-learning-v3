import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CoursesService } from './courses.service';
import { Course } from './entities/course.entity';
import { CreateCourseInput } from './dto/inputs/create-course.input';
import { UpdateCourseInput } from './dto/inputs/update-course.input';
import {JwtService} from "@nestjs/jwt";
import {MessagePattern, RpcException} from "@nestjs/microservices";

@Resolver(() => Course)
export class CoursesResolver {
  constructor(
      private readonly coursesService: CoursesService,
      private readonly jwtService: JwtService
  ) {}

  @MessagePattern('courses.create')
  async create(payload: any) {
    try {
      // Verificar token
      const token = payload.metadata?.token;
      if (!token) {
        throw new RpcException('Unauthorized - No token provided');
      }

      // Decodificar y verificar token
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET
      });

      if (decoded.role !== 'TEACHER') {
        throw new RpcException('Unauthorized - Invalid role');
      }

      // Procesar creación del curso
      const courseData = {
        ...payload,
        teacherId: decoded.sub // usar el ID del token
      };

      return this.coursesService.create(courseData);
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException(error.message || 'Error creating course');
    }
  }

  @Mutation(() => Course)
  createCourse(@Args('createCourseInput') createCourseInput: CreateCourseInput) {
    return this.coursesService.create(createCourseInput);
  }

  @Query(() => [Course], { name: 'courses' })
  findAll() {
    return this.coursesService.findAll();
  }

  @Query(() => Course, { name: 'course' })
  findOne(@Args('id', { type: () => Int }) id: string) {
    return this.coursesService.findOne(id);
  }

  @Mutation(() => Course, { name: 'updateCourse' })
  updateCourse(
      @Args('updateCourseInput') updateCourseInput: UpdateCourseInput
  ) {
    return this.coursesService.update(updateCourseInput);
  }

  @Mutation(() => Course)
  removeCourse(@Args('id', { type: () => Int }) id: number) {
    return this.coursesService.remove(id);
  }
}
