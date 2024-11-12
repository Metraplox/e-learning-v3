import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsUUID, Max, Min, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateRatingInput {
    @Field(() => String)
    @IsUUID()
    courseId: string;

    @Field(() => Int)
    @IsInt()
    @Min(1)
    @Max(5)
    rating: number;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    comment?: string;
}