import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([User]), //users 모듈이 user테이블 쓸 수 있게
    AuthModule, //auth모듈
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
