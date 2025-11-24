import { PartialType } from '@nestjs/swagger';
import { CreateMemberDto } from './create-member.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateMemberDto extends PartialType(CreateMemberDto) {
	@ApiPropertyOptional({ description: '수정할 멤버 이름', example: '김하늘' })
	name?: string;

	@ApiPropertyOptional({ description: '수정할 소개', example: '백엔드 + 인프라 겸직' })
	introduction?: string;

	@ApiPropertyOptional({ description: '새 프로필 이미지 URL', example: 'https://cdn.yellowmemo.test/members/kim_new.png' })
	imageUrl?: string;
}
