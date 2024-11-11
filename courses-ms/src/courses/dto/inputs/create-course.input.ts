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

  @Field()
  @IsUUID()
  teacherId: string;
}


// import { InputType, Int, Field } from '@nestjs/graphql';
// import {IsInt, IsOptional, IsString, IsUrl, Min} from "class-validator";
//
// @InputType()
// export class CreateCourseInput {
//   @Field(() => Int, { description: 'The price of the course' })
//   @IsInt()
//   @Min(0)
//     price: number;
//
//     @Field(() => String, { description: 'The name of the course' })
//     @IsString()
//     title: string;
//
//     @Field(() => String, { description: 'The description of the course' })
//     @IsString()
//     @IsOptional()
//     description?: string;
//
//     @Field(() => String, { description: 'The teacher of the course' })
//     @IsString()
//     teacherId: string;
//
//     @Field(() => Int, { description: 'The duration of the course' })
//     @IsInt()
//     @IsOptional()
//     duration?: number;
//
//     @Field(() => String, { description: 'The id of the course' })
//     @IsString()
//     @IsOptional()
//     id?: string;
//
//     @Field(() => String, { description: 'The category of the course' })
//     @IsString()
//     @IsOptional()
//     category?: string;
//
//     @Field(() => String, { description: 'The image of the course' })
//     @IsUrl()
//     @IsOptional()
//     image?: string;
//
//     @Field(() => String, { description: 'The video of the course' })
//     @IsString()
//     @IsUrl()
//     @IsOptional()
//     video?: string;
// }
