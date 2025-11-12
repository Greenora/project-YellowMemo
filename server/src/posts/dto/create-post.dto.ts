import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

// Contents 배열 안의 개별 스티커 객체 타입
class ContentItemDto {
  @IsString()
  @IsNotEmpty()
  type: 'text' | 'image'; // text 또는 image만 허용

  @IsString()
  value?: string; // (선택적) type='text'일 경우

  @IsString()
  url?: string; // (선택적) type='image'일 경우

  @IsNotEmpty()
  x: number;

  @IsNotEmpty()
  y: number;
}

// 최종 게시물 생성 DTO
export class CreatePostDto {
  @IsString()   
  @IsNotEmpty()
  title: string;

  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true }) //  배열 안의 객체도 검사
  @Type(() => ContentItemDto) // 배열 안의 객체는 ContentItemDto 틀을 사용
  contents: ContentItemDto[];
}