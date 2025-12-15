import { Injectable, ConflictException, UnauthorizedException, BadRequestException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';



@Injectable()
export class AuthService {
  constructor( 
    @InjectRepository(User) //user 테이블 관리자를 service에 넣음
    private usersRepository: Repository<User>,
    private jwtService: JwtService,    //토큰 발급기
  ) {}
  

  //회원가입 
  async register(registerDto: RegisterDto): Promise<{message: string}> {
    const {username, password, nickname} = registerDto;

    // admin username 금지
    if (username.toLowerCase() === 'admin') {
      throw new BadRequestException('사용할 수 없는 아이디입니다.');
    }

    //유저 중복 체크
    const existingUser = await this.usersRepository.findOne({
      where: {username}
    });
    if (existingUser) {
      throw new ConflictException('이미 존재하는 아이디입니다.');
    }

    //비밀번호 해시(암호화)
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    //새 유저 생성 및 저장
    const newUser = this.usersRepository.create({
      username,
      password_hash: hashedPassword, //password_hash에 저장
      nickname,
    });

    await this.usersRepository.save(newUser);

    return { message: '회원가입에 성공했습니다.'};
  }

  //로그인
  async login(loginDto: LoginDto): Promise<{accessToken: string}> {
    const {username, password} = loginDto;

    const user = await this.usersRepository.findOne({ where: {username}}); //유저 확인

    if (user && (await bcrypt.compare(password, user.password_hash))) {   //유저가 있고 비밀번호가 맞는지 확인한다 bcrypt가 db랑 입력 비번 비교함
      const payload = { username: user.username, sub: user.id, role: user.role };          //유저가 맞으면 토큰 생성, 토큰안에 저장할 정보 (토큰의 주인은 user.id를 가진 유저 네임)
      const accessToken = await this.jwtService.sign(payload);           //토큰 발급기가 payload정보랑 비밀키 섞어서 암호화된 토큰을 만듦

      return { accessToken: accessToken};    //토큰 발급
    }else {
      throw new UnauthorizedException('로그인 정보를 확인해주세요!') // 유저가 없거나 비번이 틀리면 401 에러
    }
  }
}