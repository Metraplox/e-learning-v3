import { registerEnumType } from '@nestjs/graphql';

export enum EnrollmentStatus {
    ACTIVE = 'ACTIVE',
    CANCELLED = 'CANCELLED',
}

registerEnumType(EnrollmentStatus, {
    name: 'EnrollmentStatus',
    description: 'Possible statuses for an enrollment',
});