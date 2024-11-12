import { ObjectType, Field, Float, Int } from '@nestjs/graphql';

@ObjectType()
export class PaymentSummary {
    @Field(() => Float)
    totalRevenue: number;

    @Field(() => Int)
    totalTransactions: number;

    @Field(() => Float)
    averageTransactionAmount: number;

    @Field(() => Float)
    totalRefunded: number;

    @Field(() => Int)
    successfulTransactions: number;

    @Field(() => Int)
    failedTransactions: number;

    @Field(() => Float)
    conversionRate: number;

    @Field(() => [DailySummary])
    dailySummary: DailySummary[];
}

@ObjectType()
export class DailySummary {
    @Field(() => Date)
    date: Date;

    @Field(() => Float)
    revenue: number;

    @Field(() => Int)
    transactions: number;

    @Field(() => Float)
    refunds: number;
}