
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PaymentStats {
    @Field()
    totalAmount: number;

    @Field()
    successfulPayments: number;

    @Field()
    failedPayments: number;

    @Field()
    refundedAmount: number;

    @Field(() => [PaymentTrend])
    trends: PaymentTrend[];
}

@ObjectType()
class PaymentTrend {
    @Field()
    date: Date;

    @Field()
    amount: number;

    @Field()
    count: number;
}