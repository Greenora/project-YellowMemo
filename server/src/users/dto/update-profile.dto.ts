import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({
    description: '변경할 닉네임',
    example: '새로운닉네임',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  nickname?: string;

  @ApiProperty({
    description: '변경할 프로필 이미지 URL',
    example: 'https://example.com/new-avatar.png',
    required: false,
  })
  @IsOptional()
  @IsString()
  image_url?: string;
}
