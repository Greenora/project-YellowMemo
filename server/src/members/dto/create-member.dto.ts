import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMemberDto {
    @ApiProperty({ description: '멤버 이름', example: '김노란' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: '간단 소개 (마크다운 가능)', example: '프론트엔드 개발자 · UI/UX 담당' })
    @IsString()
    @IsNotEmpty()
    introduction: string;

    @ApiPropertyOptional({ description: '프로필 이미지 URL', example: 'https://cdn.yellowmemo.test/members/kim.png' })
    @IsString()
    @IsOptional()
    imageUrl?: string;
}