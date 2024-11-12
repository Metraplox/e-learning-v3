import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesResolver } from './courses.resolver';
import { JwtModule } from '@nestjs/jwt';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Course} from "./entities/course.entity";
import {Enrollment} from "./entities/enrollment.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Course, Enrollment]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
  providers: [CoursesService, CoursesResolver],
  exports: [CoursesService],
})
export class CoursesModule {}
