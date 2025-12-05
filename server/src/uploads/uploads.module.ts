import { Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller';

// UploadsModule
// 이미지 파일 업로드 기능을 담당하는 모듈
// POST /uploads 엔드포인트를 제공
// 업로드된 파일은 server/uploads 폴더에 저장됨
@Module({
  controllers: [UploadsController],
})
export class UploadsModule {}
