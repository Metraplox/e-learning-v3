import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { UserRole } from '../enums/user-role.enum';

@InputType()
export class CreateUserInput {
    @Field()
    @IsString()
    @IsNotEmpty()
    username: string;

    @Field()
    @IsEmail()
    email: string;

    @Field()
    @IsString()
    @MinLength(6)
    password: string;

    @Field(() => UserRole)
    role: UserRole;
}