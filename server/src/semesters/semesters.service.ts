import { Injectable } from '@nestjs/common';
import { CreateSemesterDto } from './dto/create-semester.dto';
import { UpdateSemesterDto } from './dto/update-semester.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Semester } from './entities/semester.entity';

@Injectable()
export class SemestersService {
  constructor(
    @InjectRepository(Semester)
    private semestersRepository: Repository<Semester>,
  ) {}

  create(createSemesterDto: CreateSemesterDto) {
    return this.semestersRepository.save(createSemesterDto);
  }

  findAll() {
    return this.semestersRepository.find({
      order: { createdAt: 'DESC'},
    });
  }

  async findOne(id: number) {
    const semester = await this.semestersRepository.findOne({ where: { id } });
    if (!semester) {
      throw new Error(`Semester with ID ${id} not found`);
    }
    return semester;
  }

  async findType(type: string) {
    const semesters = await this.semestersRepository.find({
      where: { type: type as 'osaka_review' | 'semester_info' }
    });
    return semesters;
  }

  async update(id: number, updateSemesterDto: UpdateSemesterDto) {
    const semester = await this.findOne(id);
    Object.assign(semester, updateSemesterDto);
    return this.semestersRepository.save(semester);
  }

  async remove(id: number) {
    const semester = await this.findOne(id);
    await this.semestersRepository.remove(semester);
    return { message: '게시물이 삭제되었습니다.' };
  }
}
