import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Comment } from '../../comments/entities/comment.entity';

@Entity('posts') //posts 테이블이 만들어짐
export class Post extends BaseEntity {
    @PrimaryGeneratedColumn() //id (숫자, 자동증가, pk)
    id: number;

    @Column()
    title: string;
    
    @Column() //카테고리 추가 (게시판, 현지학기제)
    category: string; 

    @Column({ type: 'json'}) //json 타입으로 저장
    contents: any; // 텍스트, 이미지 배열을 통째로 저장

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn() //수정일
    updatedAt: Date;
    
    //관계 설정
    @ManyToOne(() => User) //다수 (post)가 하나(user)에 속함
    @JoinColumn({ name: 'userId' }) //db에 userId 컬럼 생성
    user: User;  //Post.user로 작성자 정보에 접근 가능

    @Column() //userId 컬럼 생성 (Db 저장용)
    userId: number; //user 테이블의 id와 연결
    
    @OneToMany(() => Comment, (comment) => comment.post) //한 게시물에 여러 댓글 달 수 있음
    comments: Comment[]; //Post.comments로 댓글 목록에 접근 가능
}
