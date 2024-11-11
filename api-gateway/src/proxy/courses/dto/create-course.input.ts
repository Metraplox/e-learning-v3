import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateCourseInput {
    @Field()
    title: string;

    @Field()
    description: string;

    @Field()
    price: number;

    @Field()
    teacherId: string;
}