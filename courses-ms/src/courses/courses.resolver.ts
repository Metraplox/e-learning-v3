import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CoursesService } from './courses.service';
import { Course } from './entities/course.entity';
import { CreateCourseInput } from './dto/inputs/create-course.input';
import { UpdateCourseInput } from './dto/inputs/update-course.input';
import {MessagePattern} from "@nestjs/microservices";

@Resolver()
export class CoursesResolver {
  constructor(private readonly coursesService: CoursesService) {}

  @Mutation(() => Course)
  createCourse(@Args('createCourseInput') createCourseInput: CreateCourseInput) {
    return this.coursesService.create(createCourseInput);
  }

  @MessagePattern('courses.findAvailable')
  async findAvailable() {
    return this.coursesService.findAvailable();
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

  @MessagePattern('courses.findAll')
  async findAll() {
    try {
      const courses = await this.coursesService.findAll();
      console.log('Courses found:', courses.length);
      return courses;
    } catch (error) {
      console.error('Error in findAll:', error);
      return [];
    }
  }

  @MessagePattern('courses.create')
  async create(data: CreateCourseInput & { teacherId: string }) {
    return this.coursesService.create(data);
  }
}
