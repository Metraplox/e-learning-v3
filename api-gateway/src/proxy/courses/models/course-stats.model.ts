
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CourseStats {
    @Field()
    totalEnrollments: number;

    @Field()
    averageRating: number;

    @Field()
    totalRevenue: number;

    @Field()
    completionRate: number;

    @Field(() => [EnrollmentTrend])
    enrollmentTrends: EnrollmentTrend[];
}

@ObjectType()
class EnrollmentTrend {
    @Field()
    date: Date;

    @Field()
    count: number;
}