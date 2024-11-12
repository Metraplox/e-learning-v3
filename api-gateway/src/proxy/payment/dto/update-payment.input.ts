import { InputType, Field, PartialType } from '@nestjs/graphql';
import { CreatePaymentInput } from './create-payment.input';
import { IsUUID } from 'class-validator';

@InputType()
export class UpdatePaymentInput extends PartialType(CreatePaymentInput) {
    @Field()
    @IsUUID()
    id: string;
}