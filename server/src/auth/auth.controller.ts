import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto'; 
import { LoginDto } from './dto/login.dto';


@Controller('auth') // API 루트는 /auth
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 회원가입 API (POST /auth/register)
  @Post('register') // 'create'가 아니라 'register' 주소
  register(@Body() registerDto: RegisterDto) {
    // 'register' 함수 호출
    return this.authService.register(registerDto);
  }

  // 로그인 API (POST /auth/login)
  @Post('login')
  login(@Body() loginDto: LoginDto): Promise<{accessToken: string}> {
    return this.authService.login(loginDto);
  }
}