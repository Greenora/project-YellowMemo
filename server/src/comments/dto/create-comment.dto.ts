import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
    @ApiProperty({ description: '댓글 내용', example: '와, 여기 진짜 멋지네요!' })
    @IsString()
    @IsNotEmpty()
    text: string;

    @ApiProperty({ description: 'x 좌표', example: 152 })
    @IsNumber()
    @IsNotEmpty()
    x: number;

    @ApiProperty({ description: 'y 좌표', example: 87 })
    @IsNumber()
    @IsNotEmpty()
    y: number;
}