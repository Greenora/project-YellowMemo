import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, Req, ForbiddenException } from '@nestjs/common';
import { MembersService } from './members.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags, ApiOkResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiNoContentResponse } from '@nestjs/swagger';
import type { Request } from 'express';
import type { User } from 'src/users/entities/user.entity';

@ApiTags('Members')
@Controller('members') //API 루트는 /members
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  //멤버 생성 API POST /members (admin만 가능)
  @Post()
  @UseGuards(AuthGuard('jwt')) //토큰 인증 필수
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: '멤버 생성 성공', schema: { example: { id: 12, name: '김노란', introduction: '프론트엔드 개발자 · UI/UX 담당', imageUrl: 'https://cdn.yellowmemo.test/members/kim.png' } } })
  create(@Body() createMemberDto: CreateMemberDto, @Req() req: Request) {
    const user = req.user as User;
    if (user.role !== 'admin') {
      throw new ForbiddenException('팀원 소개는 관리자만 작성할 수 있습니다.');
    }
    return this.membersService.create(createMemberDto);
  }

  @Get() //여긴 UseGuards가 없다 왜? 누구나 조회할 수 있어야 하니까
  @ApiOkResponse({ description: '모든 멤버 조회', schema: { example: [ { id: 12, name: '김노란', introduction: '프론트엔드 개발자 · UI/UX 담당', imageUrl: 'https://cdn.yellowmemo.test/members/kim.png' }, { id: 13, name: '이파랑', introduction: '백엔드 및 DB 튜닝 담당', imageUrl: null } ] } })
  findAll() {
    return this.membersService.findAll();
  }

  //멤버 1개 상세 조회 GET /members/:id
  @Get(':id') //여기도 똑같이 UseGuards가 왜 없냐면 누구나 조회 할 수 있어야하니까
  @ApiOkResponse({ description: '단일 멤버 조회', schema: { example: { id: 12, name: '김노란', introduction: '프론트엔드 개발자 · UI/UX 담당', imageUrl: 'https://cdn.yellowmemo.test/members/kim.png' } } })
  @ApiNotFoundResponse({ description: '해당 ID 멤버 없음' })
  findOne(@Param('id') id: string) { //url파라미터 (:id)에서 id값을 가져오고
    return this.membersService.findOne(+id); //Service의 findOne함수 호출 (id가 스트링이라 +id로 숫자로 바꿈)
  }

  //멤버 수정 PATCH /members/:id (admin만 가능)
  @Patch(':id')
  @UseGuards(AuthGuard('jwt')) //토큰 인증
  @ApiBearerAuth()
  @ApiOkResponse({ description: '멤버 수정 성공', schema: { example: { id: 12, name: '김하늘', introduction: '백엔드 + 인프라 겸직', imageUrl: 'https://cdn.yellowmemo.test/members/kim_new.png' } } })
  update(@Param('id') id: string, @Body() updateMemberDto: UpdateMemberDto, @Req() req: Request) {
    const user = req.user as User;
    if (user.role !== 'admin') {
      throw new ForbiddenException('팀원 소개는 관리자만 수정할 수 있습니다.');
    }
    return this.membersService.update(+id, updateMemberDto);
  }

  //멤버 삭제 DELETE /members/:id (admin만 가능)
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiNoContentResponse({ description: '멤버 삭제 성공 (본문 없음)' })
  @HttpCode(204) //REST 규약에 따라 204 No Content 반환
  remove(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as User;
    if (user.role !== 'admin') {
      throw new ForbiddenException('팀원 소개는 관리자만 삭제할 수 있습니다.');
    }
    this.membersService.remove(+id);
  }
}
