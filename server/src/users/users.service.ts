import { Injectable, NotFoundException } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  //내 정보 찾기 GET /users/me 
  async findMe(userId: number): Promise<Partial<User>> {
    const user = await this.usersRepository.findOne({     //user.entity에서 정의한 id로 유저를 찾는다
      where: {id: userId},
      select: ['id', 'username', 'nickname', 'image_url', 'createdAt'],  //비밀번호 해시, 토큰 관련 정보를 제외하고 필요한 정보만 선택
    });

    if(!user){
      throw new NotFoundException('사용자 정보를 찾을 수 없습니다.')
    }

    return user;
  }
}
