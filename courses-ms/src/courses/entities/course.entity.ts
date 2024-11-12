import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import {PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany} from 'typeorm';
import {Enrollment} from "./enrollment.entity";

@ObjectType()
export class Course {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  @Column()
  id: string;

  @Column()
  @Field()
  title: string;

  @Column('text')
  @Field()
  description: string;

  @Column()
  @Field()
  teacherId: string;

  @Column('decimal', { precision: 10, scale: 2 })
  @Field()
  price: number;

  @Column({ default: 0 })
  @Field()
  averageRating: number;

  @Column({ default: 0 })
  @Field()
  totalRatings: number;

    @CreateDateColumn()
    @Field()
    createdAt: Date;

    @UpdateDateColumn()
    @Field()
    updatedAt: Date;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.courseId)
  @Field(() => [Enrollment], { nullable: true })
  enrollments: Enrollment[];
}
