import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// Contents 배열 안의 개별 스티커 객체 타입
class ContentItemDto {
  @ApiProperty({ description: '콘텐츠 타입', enum: ['text', 'image'], example: 'text' })
  @IsString()
  @IsNotEmpty()
  type: 'text' | 'image'; // text 또는 image만 허용

  @ApiPropertyOptional({ description: "텍스트 내용 (type='text'일 때)", example: '첫 게시물입니다. 지도에 메모를 남겨요.' })
  @IsString()
  @IsOptional()
  value?: string; // (선택적) type='text'일 경우

  @ApiPropertyOptional({ description: "이미지 URL (type='image'일 때)", example: 'https://cdn.yellowmemo.test/images/sample.png' })
  @IsString()
  @IsOptional()
  url?: string; // (선택적) type='image'일 경우

  @ApiProperty({ description: 'x 좌표', example: 120 })
  @IsNumber()
  @Type(() => Number) 
  x: number;

  @ApiProperty({ description: 'y 좌표', example: 80 })
  @IsNumber()
  @Type(() => Number)
  y: number;
}

// 최종 게시물 생성 DTO
export class CreatePostDto {
  @ApiProperty({ description: '게시물 제목', example: '오사카 여행 메모' })  
  @IsString()   
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: '본문 콘텐츠 배열 (텍스트/이미지 스티커들)',
    type: () => [ContentItemDto],
    example: [
      { type: 'text', value: '첫 게시물입니다. 지도에 메모를 남겨요.', x: 120, y: 80 },
      { type: 'image', url: 'https://cdn.yellowmemo.test/images/sample.png', x: 200, y: 140 },
    ],
  })
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true }) //  배열 안의 객체도 검사
  @Type(() => ContentItemDto) // 배열 안의 객체는 ContentItemDto 틀을 사용
  contents: ContentItemDto[];
}