import { IsNotEmpty, IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RegisterDto {
    @ApiProperty({
        description: "로그인용 아이디",
        example: "yellowbird",
    })
    @IsString()
    @IsNotEmpty()
    username: string; //로그인 id

    @ApiProperty({
        description: "로그인 비밀번호 (최소 4자)",
        example: "pass1234",
        minLength: 4,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(4) //비밀번호는 최소 4글자
    password: string;

    @ApiProperty({
        description: "서비스에서 사용할 닉네임",
        example: "노란메모장",
    })
    @IsString()
    @IsNotEmpty()
    nickname: string;
}