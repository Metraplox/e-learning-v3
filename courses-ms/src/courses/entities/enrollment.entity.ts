import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EnrollmentStatus } from '../enums/enrollment-status.enum';

@Entity()
@ObjectType()
export class Enrollment {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => ID)
    id: string;

    @Column({ type: 'uuid' })
    @Field(() => ID)
    userId: string;

    @Column({ type: 'uuid' })
    @Field(() => ID)
    courseId: string;

    @Column({
        type: 'enum',
        enum: EnrollmentStatus,
        default: EnrollmentStatus.ACTIVE
    })
    @Field(() => EnrollmentStatus)
    status: EnrollmentStatus;

    @CreateDateColumn()
    @Field()
    enrolledAt: Date;
}