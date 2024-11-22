import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CoursesService } from './courses.service';
import { Course } from './entities/course.entity';
import { CreateCourseInput } from './dto/inputs/create-course.input';

@Resolver(() => Course)
@Controller()
export class CoursesResolver {
  constructor(private readonly coursesService: CoursesService) {}

  @Query(() => [Course], { name: 'courses' })
  async findAll(): Promise<Course[]> {
    return this.coursesService.findAll();
  }

  @Query(() => Course, { name: 'course' })
  async findOne(@Args('id') id: string): Promise<Course> {
    return this.coursesService.findOne(id);
  }

  @Mutation(() => Course)
  async createCourse(
      @Args('createCourseInput') createCourseInput: CreateCourseInput,
  ): Promise<Course> {
    return this.coursesService.create(createCourseInput);
  }

  // RabbitMQ Message Patterns
  @MessagePattern('courses.findAll')
  async findAllMessage(): Promise<Course[]> {
    return this.coursesService.findAll();
  }

  @MessagePattern('courses.findOne')
  async findOneMessage(@Payload() data: { id: string }): Promise<Course> {
    return this.coursesService.findOne(data.id);
  }

  @MessagePattern('courses.create')
  async createMessage(@Payload() createCourseInput: CreateCourseInput): Promise<Course> {
    return this.coursesService.create(createCourseInput);
  }
}