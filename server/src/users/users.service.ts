import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateProfileDto } from './dto/update-profile.dto';


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
      select: ['id', 'username', 'nickname', 'image_url', 'role', 'createdAt'],  //비밀번호 해시, 토큰 관련 정보를 제외하고 필요한 정보만 선택
    });

    if(!user){
      throw new NotFoundException('사용자 정보를 찾을 수 없습니다.')
    }

    return user;
  }

  //내 프로필 수정 PATCH /users/me
  async updateMe(userId: number, updateProfileDto: UpdateProfileDto): Promise<Partial<User>> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('사용자 정보를 찾을 수 없습니다.');
    }

    // 변경할 필드만 업데이트
    Object.assign(user, updateProfileDto);
    await this.usersRepository.save(user);

    // 비밀번호 제외하고 반환
    return this.findMe(userId);
  }
}
