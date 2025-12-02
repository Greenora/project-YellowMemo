import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('semesters')
export class Semester extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: 'semester_info' })
    type: 'osaka_review' | 'semester_info';  // osaka_review: 누구나, semester_info: admin만

    @Column()
    title: string;

    @Column({type: 'text'})
    content: string;

    @Column({type: 'longtext', nullable: true})
    imageUrl: string;

    @CreateDateColumn()
    createdAt: Date;
}