import { ObjectType, Field, ID, Float } from '@nestjs/graphql';

@ObjectType()
export class Course {
    @Field(() => ID, { description: 'ID único del curso' })
    id: string;

    @Field({ description: 'Título del curso' })
    title: string;

    @Field({ description: 'Descripción del curso', nullable: true })
    description?: string;

    @Field(() => Float, { description: 'Precio del curso' })
    price: number;

    @Field({ description: 'ID del instructor del curso' })
    teacherId: string;

    @Field({ description: 'Estado del curso' })
    status: string;

    @Field({ description: 'Fecha de creación del curso' })
    createdAt: Date;

    @Field({ description: 'Fecha de última actualización del curso' })
    updatedAt: Date;
}