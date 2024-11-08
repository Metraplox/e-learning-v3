import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn } from 'typeorm';
import { UserRole } from '../enums/user-role.enum';

@Entity()
@ObjectType()
export class User {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => ID)
    id: string;

    @Column({ unique: true })
    @Field(() => ID)
    username: string;

    @Column({ unique: true })
    @Field()
    email: string;

    @Column()
    password: string;

    @Column({
      type: 'enum',
      enum: UserRole,
      default: UserRole.STUDENT
    })
    @Field(() => UserRole)
    role: UserRole;

    // @ManyToOne(() => Course, (course) => course.students)
    // @JoinTable()
    // courses: Course[];

    // @OneToMany(() => Course, (course) => course.teacher)
    // teachingCourses: Course[];

    @CreateDateColumn()
    @Field()
    createdAt: Date;

    @UpdateDateColumn()
    @Field()
    updatedAt: Date;
}
