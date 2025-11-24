import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto'; 
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';


@ApiTags('Auth')
@Controller('auth') // API 루트는 /auth
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 회원가입 API POST /auth/register
  @Post('register') // 'create'가 아니라 'register' 주소
  @ApiCreatedResponse({ description: '회원가입 성공', schema: { example: { id: 7, username: 'yellowbird92', nickname: '노란메모', createdAt: '2025-11-12T07:30:00.000Z' } } })
  register(@Body() registerDto: RegisterDto) {
    // 'register' 함수 호출
    return this.authService.register(registerDto);
  }

  // 로그인 API POST /auth/login
  @Post('login')
  @ApiOkResponse({ description: '로그인 성공', schema: { example: { accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' } } })
  login(@Body() loginDto: LoginDto): Promise<{accessToken: string}> {
    return this.authService.login(loginDto);
  }
}