import {Args, Int, Mutation, Query, Resolver} from '@nestjs/graphql';
import {CoursesService} from './courses.service';
import {Course} from './entities/course.entity';
import {CreateCourseInput} from './dto/inputs/create-course.input';
import {UpdateCourseInput} from './dto/inputs/update-course.input';
import {MessagePattern, Payload} from "@nestjs/microservices";
import {UseGuards} from "@nestjs/common";

function JwtAuthGuard() {

}

@Resolver()
export class CoursesResolver {
  constructor(private readonly coursesService: CoursesService) {}

  @Mutation(() => Course)
  async createCourse(@Args('createCourseInput') createCourseInput: CreateCourseInput) {
    return this.coursesService.create(createCourseInput);
  }

  @Mutation(() => Course, { name: 'updateCourse' })
  async updateCourse(
      @Args('updateCourseInput') updateCourseInput: UpdateCourseInput
  ) {
    return this.coursesService.update(updateCourseInput);
  }

  @Mutation(() => Course)
  async removeCourse(@Args('id', { type: () => Int }) id: number) {
    return this.coursesService.remove(id);
  }

  @MessagePattern('courses.findAll')
  async findAll() {
    return this.coursesService.findAll();
  }

  @MessagePattern('courses.findOne')
  async findOne(@Payload() data: { id: string }) {
    return this.coursesService.findOne(data.id);
  }

  @MessagePattern('courses.findOneWithDetails')
  async findOneWithDetails(@Payload() data: { id: string }) {
    return this.coursesService.findOneWithLessons(data.id);
  }

  @MessagePattern('courses.create')
  async create(@Payload() data: CreateCourseInput & { teacherId: string }) {
    return this.coursesService.create(data);
  }

  @MessagePattern('courses.update')
  async update(@Payload() data: { id: string, updateCourseInput: UpdateCourseInput }) {
    return this.coursesService.update(data.updateCourseInput);
  }

  @MessagePattern('courses.remove')
  async remove(@Payload() data: { id: string }) {
    return this.coursesService.remove(Number(data.id));
  }

  @MessagePattern('courses.enroll')
  async enroll(@Payload() data: { userId: string, courseId: string }) {
    return this.coursesService.enroll(data);
  }

  @MessagePattern('courses.rate')
  async rate(@Payload() data: { courseId: string, userId: string, rating: number }) {
    return this.coursesService.rate(data);
  }

  // Los métodos GraphQL ahora también tienen su correspondiente MessagePattern
  @Query(() => Course, { name: 'course' })
  async getCourse(@Args('id', { type: () => Int }) id: string) {
    return this.coursesService.findOne(id);
  }

  @Query(() => Course, { name: 'courseDetails' })
  @UseGuards(JwtAuthGuard)
  async getCourseDetails(@Args('id', { type: () => Int }) id: string) {
    return this.coursesService.findOneWithLessons(id);
  }
}
