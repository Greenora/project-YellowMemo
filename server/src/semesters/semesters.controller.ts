import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode } from '@nestjs/common';
import { SemestersService } from './semesters.service';
import { CreateSemesterDto } from './dto/create-semester.dto';
import { UpdateSemesterDto } from './dto/update-semester.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags, ApiCreatedResponse, ApiOkResponse, ApiNoContentResponse } from '@nestjs/swagger';


@ApiTags('Semesters')
@Controller('semesters')
export class SemestersController {
  constructor(private readonly semestersService: SemestersService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: '현지학기제가 성공적으로 생성되었습니다.',
    schema: {
      example: {
        id: 1,
        title: '2024년 봄학기 오사카 현지학기제',
        content: '오사카에서 진행되는 현지학기제 프로그램입니다. 일본 문화 체험과 언어 학습을 병행하며, 현지 대학과의 교류를 통해 글로벌 역량을 키울 수 있습니다.',
        imageUrl: 'https://example.com/images/osaka-semester-2024.jpg',
        createdAt: '2024-03-15T09:00:00.000Z'
      }
    }
  })
  create(@Body() createSemesterDto: CreateSemesterDto) {
    return this.semestersService.create(createSemesterDto);
  }

  @Get()
  @ApiOkResponse({
    description: '모든 현지학기제 목록을 조회합니다.',
    schema: {
      example: [
        {
          id: 1,
          title: '2024년 봄학기 오사카 현지학기제',
          content: '오사카에서 진행되는 현지학기제 프로그램입니다.',
          imageUrl: 'https://example.com/images/osaka-semester-2024.jpg',
          createdAt: '2024-03-15T09:00:00.000Z'
        },
        {
          id: 2,
          title: '2024년 가을학기 도쿄 현지학기제',
          content: '도쿄에서 진행되는 현지학기제 프로그램입니다.',
          imageUrl: 'https://example.com/images/tokyo-semester-2024.jpg',
          createdAt: '2024-09-01T09:00:00.000Z'
        }
      ]
    }
  })
  findAll() {
    return this.semestersService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({
    description: '특정 현지학기제 정보를 조회합니다.',
    schema: {
      example: {
        id: 1,
        title: '2024년 봄학기 오사카 현지학기제',
        content: '오사카에서 진행되는 현지학기제 프로그램입니다. 일본 문화 체험과 언어 학습을 병행하며, 현지 대학과의 교류를 통해 글로벌 역량을 키울 수 있습니다.',
        imageUrl: 'https://example.com/images/osaka-semester-2024.jpg',
        createdAt: '2024-03-15T09:00:00.000Z'
      }
    }
  })
  findOne(@Param('id') id: string) {
    return this.semestersService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOkResponse({
    description: '현지학기제가 성공적으로 수정되었습니다.',
    schema: {
      example: {
        id: 1,
        title: '2024년 봄학기 오사카 현지학기제 (수정됨)',
        content: '오사카에서 진행되는 현지학기제 프로그램입니다. 프로그램 내용이 업데이트되었습니다.',
        imageUrl: 'https://example.com/images/osaka-semester-2024-updated.jpg',
        createdAt: '2024-03-15T09:00:00.000Z'
      }
    }
  })
  update(@Param('id') id: string, @Body() updateSemesterDto: UpdateSemesterDto) {
    return this.semestersService.update(+id, updateSemesterDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @HttpCode(204)
  @ApiNoContentResponse({
    description: '현지학기제가 성공적으로 삭제되었습니다.'
  })
  remove(@Param('id') id: string) {
    return this.semestersService.remove(+id);
  }
}
