import {ObjectType, Field, Int, ID} from '@nestjs/graphql';
import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from "typeorm";
import {PaymentStatus} from "../enums/payment-status.enum";


@Entity()
@ObjectType()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  @Column()
  id: string;

  @Column('uuid')
  @Field()
  userId: string;

  @Column('uuid')
  @Field()
  courseId: string;

  @Column('decimal', { precision: 10, scale: 2 })
  @Field()
  amount: number;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING
  })
  @Field(() => PaymentStatus)
  status: PaymentStatus;

  @Column({ nullable: true })
  @Field({ nullable: true })
  webpayToken: string;

  @CreateDateColumn()
  @Field()
  createdAt: Date;
}
