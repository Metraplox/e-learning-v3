
import { InputType, Field, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID, Min, IsEnum, IsOptional } from 'class-validator';
import { PaymentProvider } from '../enums/payment-provider.enum';

@InputType()
export class CreatePaymentInput {
    @Field(() => String)
    @IsUUID()
    @IsNotEmpty()
    courseId: string;

    @Field(() => Float)
    @Min(0)
    amount: number;

    @Field(() => PaymentProvider)
    @IsEnum(PaymentProvider)
    provider: PaymentProvider;

    @Field(() => String, { nullable: true })
    @IsOptional()
    metadata?: string;
}