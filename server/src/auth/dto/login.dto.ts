import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
    @ApiProperty({
        description: "회원가입 시 사용한 아이디",
        example: "yellowbird",
    })
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty({
        description: "회원가입 시 설정한 비밀번호",
        example: "pass1234",
    })
    @IsString()
    @IsNotEmpty()
    password: string;
}