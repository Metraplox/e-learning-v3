import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreatePaymentInput {
    @Field()
    courseId: string;

    @Field()
    amount: number;

    @Field()
    userId: string;
}
