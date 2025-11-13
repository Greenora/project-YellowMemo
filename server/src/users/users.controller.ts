import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import type { User } from './entities/user.entity';
import type { Request } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('users') // API /users
export class UsersController {
  constructor(private readonly usersService: UsersService){}

  // 내 정보 조회 API GET /users/me
  @Get('me') // 최종 주소는 GET /users/me
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))   //findme를 실행하기전에 반드시 통과해야함
  findMe(@Req() req: Request): Promise<Partial<User>> {
    const user = req.user as User;    //Request 객체에서 토큰 검사기가 넣어준 user 정보를 꺼냄
    return this.usersService.findMe(user.id); //Service에 user.id를 넘겨서 db에서 정보를 가져온다 (비번제외)
  }
}