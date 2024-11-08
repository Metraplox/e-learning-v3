import { registerEnumType } from '@nestjs/graphql';

export enum UserRole {
    ADMIN = 'ADMIN',
    TEACHER = 'TEACHER',
    STUDENT = 'STUDENT',
}

registerEnumType(UserRole, {
    name: 'UserRole',
    description: 'Roles disponibles para usuarios',
});