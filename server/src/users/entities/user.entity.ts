import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Comment } from '../../comments/entities/comment.entity';


@Entity('users') //users 테이블이 만들어짐
export class User extends BaseEntity {
    @ApiProperty({
        description: "자동 증가 고유 ID",
        example: 1,
    })
    @PrimaryGeneratedColumn() //id (숫자, 자동증가, pk)
    id: number;
    
    @ApiProperty({
        description: "로그인 아이디 (고유)",
        example: "yellowbird",
    })
    @Column({ unique: true }) //username 중복 불가능
    username: string;

    @ApiProperty({
        description: "암호화된 비밀번호",
        example: "$2b$10$1abCdEfGhIjKlMnOpQrStu",
    })
    @Column()
    password_hash: string; //비밀번호 해시값

    @ApiProperty({
        description: "서비스에서 표시되는 닉네임",
        example: "노란메모장",
    })
    @Column()
    nickname: string;

    @ApiProperty({
        description: "프로필 이미지 URL",
        example: "https://example.com/avatar.png",
        nullable: true,
    })
    @Column({ nullable: true }) //image_url (null가능)
    image_url: string;

    @ApiProperty({
        description: "계정 생성 일시",
        example: "2025-11-12T07:30:00.000Z",
    })
    @CreateDateColumn() //생성일
    createdAt: Date;

    @OneToMany(() => Comment, (comment) => comment.user) //한 사용자가 여러 댓글 달 수 있음
    comments: Comment[]; //User.comments로 댓글 목록에 접근 가능
}