import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('members')
export class Member extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({type: 'text'})
    introduction: string;

    @Column({type: 'longtext', nullable: true})
    imageUrl: string;
}