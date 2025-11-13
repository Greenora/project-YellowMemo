import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/users/entities/user.entity';
import type { Request } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('posts') //API 루트는 /posts 
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  //게시물 생성 API POST/ posts
  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt')) //토큰 인증 필수
  create(
    @Req() req: Request,  //토큰에서 User 정보 가져온다
    @Body() createPostDto: CreatePostDto  //Body에서 DTO데이터를 가져오고
  ) {
    const user = req.user as User;   //req.user에서 로그인한 유저 id를 추출함
    return this.postsService.create(createPostDto, user.id) // Service 함수 호출 시 DTO와 함께 userid를 전달
  }

  @Get()   //여긴 왜 UseGuards가 없냐면 누구나 조회 할 수 있어야하니까
  findAll() {
    return this.postsService.findAll();
  }

  //게시물 1개 상세 조회 GET /posts/:id
  @Get(':id') //여기도 똑같이 UseGuards가 왜 없냐면 누구나 조회 할 수 있어야하니까
  findOne(@Param('id') id: string) {     //url파라미터 (:id)에서 id값을 가져오고
    return this.postsService.findOne(+id); //Service의 findOne함수 호출 (id가 스트링이라 +id로 숫자로 바꿈)
  }

  //게시물 수정 PATCH /posts/:id
  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt')) //토큰 인증
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto, @Req() req: Request) {  //토큰에서 유저 정보 가져오고
    const user = req.user as User;  //유저 id를 추출함
    return this.postsService.update(+id, updatePostDto, user.id); //Service에 3개를 다 넘김
  }

  //게시믈 삭제 DELETE /posts/:id
  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string, @Req() req: Request) { //토큰에서 유저 정보 가져오고고
    const user = req.user as User; //유저 id를 추출함
    return this.postsService.remove(+id, user.id); //Service에 2개 다 넘김
  }
}
