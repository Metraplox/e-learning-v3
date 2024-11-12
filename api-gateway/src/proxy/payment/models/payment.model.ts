
import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { PaymentStatus } from '../enums/payment-status.enum';
import { PaymentProvider } from '../enums/payment-provider.enum';

@ObjectType()
export class Payment {
    @Field(() => ID)
    id: string;

    @Field(() => ID)
    userId: string;

    @Field(() => ID)
    courseId: string;

    @Field(() => Float)
    amount: number;

    @Field(() => PaymentStatus)
    status: PaymentStatus;

    @Field(() => PaymentProvider)
    provider: PaymentProvider;

    @Field({ nullable: true })
    transactionId?: string;

    @Field({ nullable: true })
    webpayToken?: string;

    @Field(() => String, { nullable: true })
    failureReason?: string;

    @Field(() => Boolean)
    isRefunded: boolean;

    @Field(() => Float, { nullable: true })
    refundedAmount?: number;

    @Field(() => Date, { nullable: true })
    refundedAt?: Date;

    @Field(() => Date)
    createdAt: Date;

    @Field(() => Date)
    updatedAt: Date;

    @Field(() => String, { nullable: true })
    metadata?: string;
}