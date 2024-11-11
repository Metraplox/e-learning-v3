import { ObjectType, Field, ID } from '@nestjs/graphql';
import { EnrollmentStatus } from '../enums/enrollment-status.enum';

@ObjectType()
export class Enrollment {
    @Field(() => ID)
    id: string;

    @Field(() => ID)
    userId: string;

    @Field(() => ID)
    courseId: string;

    @Field(() => EnrollmentStatus)
    status: EnrollmentStatus;

    @Field()
    enrolledAt: Date;
}