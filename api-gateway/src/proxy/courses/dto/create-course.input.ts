import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsString, IsUUID, Min } from 'class-validator';

@InputType()
export class CreateCourseInput {
    @Field()
    @IsString()
    @IsNotEmpty()
    title: string;

    @Field({ nullable: true })
    @IsString()
    description?: string;

    @Field()
    @IsNumber()
    @Min(0)
    price: number;
}