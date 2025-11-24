import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

// 전역 예외 필터 (모든 HTTP 에러를 여기서 통일된 형식으로 처리)
@Catch(HttpException) // HttpException 타입의 에러만 잡음
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp(); // HTTP 컨텍스트 가져오기
    const response = ctx.getResponse<Response>(); // 응답 객체
    const status = exception.getStatus(); // 에러 상태 코드 (예: 401, 404, 500 등)
    const exceptionResponse = exception.getResponse(); // 에러 응답 내용

    // 기본 에러 메시지 (만약 메시지를 추출하지 못하면 이걸 사용)
    let message = '알 수 없는 오류가 발생했습니다.';

    // 에러 응답이 문자열이면 그대로 사용
    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } 
    // 에러 응답이 객체이고 message 속성이 있으면 추출
    else if (typeof exceptionResponse === 'object' && 'message' in exceptionResponse) {
      const msg = exceptionResponse.message;
      // message가 배열이면 첫 번째 요소만, 아니면 그대로 사용
      message = Array.isArray(msg) ? msg[0] : msg;
    }

    // 401 Unauthorized 에러는 무조건 "로그인이 필요합니다."로 통일
    // (토큰 없음, 토큰 만료, 토큰 오류 등 모든 인증 실패 케이스)
    if (status === HttpStatus.UNAUTHORIZED) {
      message = '로그인이 필요합니다.';
    }

    // 클라이언트에게 통일된 형식으로 에러 응답 전송
    response.status(status).json({
      statusCode: status, // 상태 코드
      message: message, // 에러 메시지
      error: exception.name, // 에러 이름 (예: UnauthorizedException)
    });
  }
}
