import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class CourseRating {
    @Field(() => ID)
    id: string;

    @Field(() => ID)
    courseId: string;

    @Field(() => ID)
    userId: string;

    @Field(() => Int)
    rating: number;

    @Field({ nullable: true })
    comment?: string;

    @Field(() => Date)
    createdAt: Date;

    @Field(() => Date)
    updatedAt: Date;
}