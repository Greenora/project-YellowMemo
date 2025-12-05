import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { MembersModule } from './members/members.module';
import { SemestersModule } from './semesters/semesters.module';
import { UploadsModule } from './uploads/uploads.module';


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
      synchronize: true, // 개발용: 엔티티 변경 시 DB 자동 동기화 (프로덕션에서는 false)
      migrationsRun: false, // synchronize: true 사용 시 마이그레이션 비활성화
    }),

    //만든 모듈들
    AuthModule,
    UsersModule,
    PostsModule,
    CommentsModule,
    MembersModule,
    SemestersModule,
    UploadsModule,
  ],
  controllers: [], //기본 컨트롤러/서비스는 안 씀
  providers: [],
})
export class AppModule {}