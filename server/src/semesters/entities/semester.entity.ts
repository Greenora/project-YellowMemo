import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('semesters')
export class Semester extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({type: 'text'})
    content: string;

    @Column({type: 'longtext', nullable: true})
    imageUrl: string;

    @CreateDateColumn()
    createdAt: Date;
}