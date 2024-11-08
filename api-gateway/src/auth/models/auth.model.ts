import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '../../proxy/users/models/user.model';

@ObjectType()
export class Auth {
    @Field(() => String)
    token: string;

    @Field(() => User)
    user: User;
}