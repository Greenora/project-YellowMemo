import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';


@Module({
  imports: [
    //env 파일 읽기 설정
    ConfigModule.forRoot({
      isGlobal: true, //앱 전체에서 process.env 사용 가능
      envFilePath: '.env', // 루트 폴더의 .env 파일 사용
    }),

    //DB 연결 설정 (TypeORM)
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST, // .env의 DB_HOST
      port: parseInt(process.env.DB_PORT || '3306', 10), // .env의 DB_PORT
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // 엔티티 파일 자동 로드
      synchronize: true, // true면 엔티티 기준으로 DB 테이블 자동 생성 (개발용)
    }),

    //만든 모듈들
    AuthModule,
    UsersModule,
    PostsModule,
    CommentsModule,
  ],
  controllers: [], //기본 컨트롤러/서비스는 안 씀
  providers: [],
})
export class AppModule {}