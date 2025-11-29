import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import { User } from 'src/users/entities/user.entity';
import { ApiBearerAuth, ApiTags, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';

@ApiTags('Comments')
@Controller('posts/:postId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  //새 댓글 생성 POST /posts/:postId/comments
  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt')) //토큰 경비원 배치
  @ApiCreatedResponse({ description: '댓글 생성 성공', schema: { example: { id: 101, text: '와, 여기 진짜 멋지네요!', x: 152, y: 87, postId: 42, userId: 7, createdAt: '2025-11-12T08:00:00.000Z' } } })
  create(@Param('postId') postId: string, @Req() req: Request, @Body() createCommentDto: CreateCommentDto) { //url에서 postid가져오고 토큰에서 user정보 가져옴
    const user = req.user as User;
    return this.commentsService.create(createCommentDto, +postId, user.id); //Service에 3개 다 넘기는데 postId는 숫자로 변환
  }

  //특정 게시물의 모든 댓글 조회 GET /posts/:postId/comments
  @Get()   //UseGuards 없다 왜? 누구나 조회 가능해야하니까 
  @ApiOkResponse({ description: '특정 게시물의 댓글 목록', schema: { example: [{ id: 101, text: '와, 여기 진짜 멋지네요!', x: 152, y: 87, postId: 42, user: { id: 7, nickname: '노란메모', image_url: null } }] } })
  findAllByPostId(@Param('postId') postId: string) {   
    return this.commentsService.findAllByPostId(+postId);  //url에서 postid를 가져와서 Service로 넘김
  }

  @Get(':id')
  @ApiOkResponse({ description: '댓글 단건 조회', schema: { example: { id: 101, text: '와, 여기 진짜 멋지네요!', x: 152, y: 87, postId: 42, userId: 7 } } })
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(+id);
  }

  //댓글 수정 PATCH /posts/:postId/comments/:id
  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt')) //토큰 경비원 배치
  @ApiOkResponse({ description: '댓글 수정 성공', schema: { example: { id: 101, text: '수정된 댓글 내용', x: 152, y: 87 } } })
  update(@Param('id') id: string, @Req() req: Request, @Body() updateCommentDto: UpdateCommentDto) { //댓글 id, 유저 정보, 수정할 내용
    const user = req.user as User;
    return this.commentsService.update(+id, updateCommentDto, user.id);
  }


  //댓글 삭제 DELETE /posts/postId/comments/:id
  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({ description: '댓글 삭제 성공', schema: { example: { message: '댓글이 삭제되었습니다.' } } })
  remove(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as User;
    return this.commentsService.remove(+id, user.id);
  }
}
