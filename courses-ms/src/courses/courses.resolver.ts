import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CoursesService } from './courses.service';
import { Course } from './entities/course.entity';
import { CreateCourseInput } from './dto/inputs/create-course.input';
import { UpdateCourseInput } from './dto/inputs/update-course.input';

@Resolver(() => Course)
export class CoursesResolver {
  constructor(private readonly coursesService: CoursesService) {}

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
