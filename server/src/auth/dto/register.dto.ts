import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class RegisterDto {
    @IsString()
    @IsNotEmpty()
    username: string; //로그인 id

    @IsString()
    @IsNotEmpty()
    @MinLength(4) //비밀번호는 최소 4글자
    password: string;

    @IsString()
    @IsNotEmpty()
    nickname: string;
}