import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'; 
import { ValidationPipe } from '@nestjs/common'; 
import { HttpExceptionFilter } from './filters/http-exception.filter'; 

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //CORS 설정 (프론트 3001번 포트 허용)
  app.enableCors({
    origin: 'http://localhost:3001',
    credentials: true,
  });

  //Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('Yellow Memo Project API')
    .setDescription('NestJS 백엔드 API 명세서')
    .setVersion('1.0')
    .addBearerAuth() //JWT 토큰 입력 필드 추가
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Swagger 주소는 /api

  //전역 예외 필터 (모든 에러 메시지 통일)
  app.useGlobalFilters(new HttpExceptionFilter());

  //유효성 검사 글로벌 파이프 (DTO 작동하게 함)
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.listen(3000);
}
bootstrap()