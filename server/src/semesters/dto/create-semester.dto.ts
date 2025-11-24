import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateSemesterDto {
    @ApiProperty({
        description: '현지학기제 제목',
        example: '2024년 봄학기 오사카 현지학기제'
    })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({
        description: '현지학기제 내용',
        example: '오사카에서 진행되는 현지학기제 프로그램입니다. 일본 문화 체험과 언어 학습을 병행하며, 현지 대학과의 교류를 통해 글로벌 역량을 키울 수 있습니다.'
    })
    @IsString()
    @IsNotEmpty()
    content: string;

    @ApiPropertyOptional({
        description: '현지학기제 대표 이미지 URL',
        example: 'https://example.com/images/osaka-semester-2024.jpg'
    })
    @IsString()
    @IsOptional()
    imageUrl?: string;
}

