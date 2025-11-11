import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';


@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt'}), //passport 모듈 등록 

    JwtModule.register({         //JWT 모듈 등록 및 설정
      secret: 'YOUR_SECRET_KEY',  //임시 (나중에 .env)
      signOptions: {           
        expiresIn: 3600, //토큰 만료 시간 (초)
      },
    }),
    TypeOrmModule.forFeature([User]),], // auth 모듈이 user테이블을 쓸 수 있게 등록록
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
