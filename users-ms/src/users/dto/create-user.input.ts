import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { UserRole } from '../enums/user-role.enum';

@InputType()
export class CreateUserInput {
    @Field()
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @Field()
    @IsString()
    username: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @Field(() => UserRole, { defaultValue: UserRole.STUDENT })
    role: UserRole;
}
