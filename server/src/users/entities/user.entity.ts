import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Comment } from '../../comments/entities/comment.entity';


@Entity('users') //users 테이블이 만들어짐
export class User extends BaseEntity {
    @PrimaryGeneratedColumn() //id (숫자, 자동증가, pk)
    id: number;
    
    @Column({ unique: true }) //username 중복 불가능
    username: string;

    @Column()
    password_hash: string; //비밀번호 해시값

    @Column()
    nickname: string;

    @Column({ nullable: true }) //image_url (null가능)
    image_url: string;

    @CreateDateColumn() //생성일
    createdAt: Date;

    @OneToMany(() => Comment, (comment) => comment.user) //한 사용자가 여러 댓글 달 수 있음
    comments: Comment[]; //User.comments로 댓글 목록에 접근 가능
}