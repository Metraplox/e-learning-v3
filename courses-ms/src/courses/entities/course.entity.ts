import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { PrimaryGeneratedColumn, Column } from 'typeorm';
import {IsNumber, IsPositive, IsString} from 'class-validator';

@ObjectType()
export class Course {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID, { description: 'The id of the course' })
  @Column()
  @IsString()
    id: string;

    @Field(() => String, { description: 'The name of the course' })
    @Column()
    @IsString()
    name: string;

    @Field(() => String, { description: 'The description of the course' })
    @Column()
    description: string;

    @Field(() => Int, { description: 'The price of the course' })
    @Column()
    @IsPositive()
    price: number;

    @Field(() => Int, { description: 'The duration of the course' })
    @Column()
    @IsNumber()
    @IsPositive()
    duration: number = 0;

    @Field(() => String, { description: 'The teacher of the course' })
    @Column()
    teacher: string;
}
