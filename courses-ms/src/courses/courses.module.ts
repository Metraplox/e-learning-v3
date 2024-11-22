import { Module } from '@nestjs/common';
import { CoursesResolver } from './courses.resolver';
import { CoursesService } from './courses.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Course])],
  providers: [CoursesResolver, CoursesService],
})
export class CoursesModule {}