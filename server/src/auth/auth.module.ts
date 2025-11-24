import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt'}), //passport 모듈 등록 

    JwtModule.registerAsync({         //JWT 모듈 등록 및 설정
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),// .env에 있는 JWT_SECRET 값을 가져옴 (없으면 에러 나게 getOrThrow 사용 추천)
        signOptions: {
          expiresIn: '1d', //토큰 만료 시간 (초)
        },
      }),
    }),
    TypeOrmModule.forFeature([User]),], // auth 모듈이 user테이블을 쓸 수 있게 등록록
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], 
  exports: [JwtStrategy, PassportModule], //다른 모듈에서 쓸 수 있게 
})
export class AuthModule {}
