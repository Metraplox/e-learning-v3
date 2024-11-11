import { InputType, Field } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class EnrollCourseInput {
    @Field()
    @IsUUID()
    userId: string;

    @Field()
    @IsUUID()
    courseId: string;
}