import { InputType, Field, Float } from '@nestjs/graphql';
import { IsUUID, IsOptional, Min } from 'class-validator';

@InputType()
export class RefundPaymentInput {
    @Field()
    @IsUUID()
    paymentId: string;

    @Field(() => Float, { nullable: true })
    @IsOptional()
    @Min(0)
    amount?: number;

    @Field({ nullable: true })
    @IsOptional()
    reason?: string;
}