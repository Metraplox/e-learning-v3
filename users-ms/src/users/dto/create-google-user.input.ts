// dto/create-google-user.input.ts en el microservicio de usuarios

import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { UserRole } from '../enums/user-role.enum';

@InputType()
export class CreateGoogleUserInput {
    @Field()
    @IsString()
    @IsNotEmpty()
    username: string;

    @Field()
    @IsEmail()
    email: string;

    @Field(() => UserRole, { nullable: true })
    role?: UserRole;
}
