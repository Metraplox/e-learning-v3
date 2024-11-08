import {ObjectType, Field, Int, ID} from '@nestjs/graphql';
import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from "typeorm";
import {PaymentStatus} from "../enums/payment-status.enum";


@Entity()
@ObjectType()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field()
  userId: string;

  @Column()
  @Field()
  courseId: string;

  @Column('decimal', { precision: 10, scale: 2 })
  @Field()
  amount: number;

  @Column()
  @Field()
  status: PaymentStatus;

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @Field()
  @Column({ nullable: true })
  webpayToken: string;
}
