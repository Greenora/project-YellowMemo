import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';

// UploadsController
// 이미지 파일 업로드 기능을 제공하는 컨트롤러
// 유저/어드민 모두 이 API를 통해 이미지 업로드 (Base64 대신 파일 저장 방식)
// 업로드된 파일은 /uploads 폴더에 저장되고, URL을 반환함
// 반환된 URL을 프론트에서 DB에 저장하여 사용

// 허용할 이미지 확장자 목록
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

// 파일명 생성 함수
// 중복 방지를 위해 타임스탬프 + 랜덤 문자열 조합
// 예: 1764940990059-znbbtp.jpg
const generateFilename = (file: { originalname: string }): string => {
  const timestamp = Date.now(); // 현재 시간 (밀리초)
  const randomStr = Math.random().toString(36).substring(2, 8); // 6자리 랜덤 문자열
  const ext = extname(file.originalname).toLowerCase(); // 원본 파일의 확장자 추출
  return `${timestamp}-${randomStr}${ext}`;
};

@ApiTags('uploads') // Swagger 태그
@Controller('uploads') // /uploads 경로로 라우팅
export class UploadsController {
  // POST /uploads - 이미지 파일 업로드
  // FormData로 file 필드에 이미지를 담아 전송
  // 성공 시 { url: "/uploads/파일명" } 반환
  @Post()
  @ApiOperation({ summary: '이미지 파일 업로드' })
  @ApiConsumes('multipart/form-data') // multipart 형식 명시
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: '업로드할 이미지 파일 (jpg, png, gif, webp)',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      // 'file' 필드에서 파일 추출
      storage: diskStorage({
        destination: './uploads', // 저장 폴더 (server/uploads)
        filename: (req, file, callback) => {
          callback(null, generateFilename(file)); // 생성된 파일명으로 저장
        },
      }),
      limits: {
        fileSize: 10 * 1024 * 1024, // 파일 크기 제한: 10MB
      },
      fileFilter: (req, file, callback) => {
        // 확장자 검사 - 허용된 이미지 형식만 통과
        const ext = extname(file.originalname).toLowerCase();
        if (ALLOWED_EXTENSIONS.includes(ext)) {
          callback(null, true); // 허용
        } else {
          callback(
            new BadRequestException(
              `허용되지 않는 파일 형식입니다. (허용: ${ALLOWED_EXTENSIONS.join(', ')})`,
            ),
            false, // 거부
          );
        }
      },
    }),
  )
  uploadFile(
    @UploadedFile() file: { filename: string; originalname: string; size: number },
  ) {
    // 파일이 없는 경우 에러
    if (!file) {
      throw new BadRequestException('파일이 없습니다.');
    }

    // 업로드된 파일의 접근 URL 생성
    // 프론트에서 이 URL을 사용하여 이미지 표시
    const url = `/uploads/${file.filename}`;

    return {
      message: '파일 업로드 성공',
      url: url, // 이미지 접근 경로 (예: /uploads/1764940990059-znbbtp.jpg)
      filename: file.filename, // 저장된 파일명
      originalname: file.originalname, // 원본 파일명
      size: file.size, // 파일 크기 (bytes)
    };
  }
}
