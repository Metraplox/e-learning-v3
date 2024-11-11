import { registerEnumType } from '@nestjs/graphql';

export enum CourseStatus {
    DRAFT = 'DRAFT',
    PUBLISHED = 'PUBLISHED',
    ARCHIVED = 'ARCHIVED',
}

registerEnumType(CourseStatus, {
    name: 'CourseStatus',
    description: 'Estado de los cursos',
});