import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity()
@Index(['courseId', 'userId'], { unique: true })
export class CourseRating {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('uuid')
    courseId: string;

    @Column('uuid')
    userId: string;

    @Column('smallint')
    rating: number;

    @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}