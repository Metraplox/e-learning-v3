import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { PaymentService } from './payment.service';
import { Payment } from './entities/payment.entity';

@Resolver(() => Payment)
export class PaymentResolver {
  constructor(private readonly paymentService: PaymentService) {}

  @Mutation(() => Payment)
  async createPayment(
      @Args('courseId') courseId: string,
      @Args('amount') amount: number,
      @Args('userId') userId: string,
  ) {
    return this.paymentService.createPayment(
        courseId,
        userId,
        amount,
    );
  }

  @Query(() => Payment, { nullable: true })
  async payment(@Args('id') id: string) {
    return this.paymentService.findOne(id);
  }
}
