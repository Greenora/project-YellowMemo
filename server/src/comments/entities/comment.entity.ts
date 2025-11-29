import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Post } from '../../posts/entities/post.entity';

@Entity('comments') //comments 테이블이 만들어짐
export class Comment extends BaseEntity {
    @PrimaryGeneratedColumn() //id (숫자, 자동증가, pk)
    id: number;

    @Column() //댓글 스티커 내용
    text: string;

    @Column() // x좌표
    x: number;

    @Column() // y좌표
    y: number;

    @CreateDateColumn() //생성일
    createdAt: Date;

    //관계 (어느 게시물에 달렸나?)
    @ManyToOne(() => Post, (post) => post.comments) //다수 (comment)가 하나(post)에 속함
    @JoinColumn({ name: 'postId' })
    post: Post;

    @Column() //postid 저장용
    postId: number;

    //관계 (누가 달았나?)
    @ManyToOne(() => User,(user) => user.comments)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    userId: number;
    
}