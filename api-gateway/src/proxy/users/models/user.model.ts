import { ObjectType, Field, ID } from '@nestjs/graphql';
import { UserRole } from '../enums/user-role.enum';

@ObjectType()
export class User {
    @Field(() => ID)
    id: string;

    @Field(() => String)
    username: string;

    @Field(() => String)
    email: string;

    // No exponer password en GraphQL
    password?: string;

    @Field(() => UserRole)
    role: UserRole;

    @Field(() => Date)
    createdAt: Date;

    @Field(() => Date)
    updatedAt: Date;
}