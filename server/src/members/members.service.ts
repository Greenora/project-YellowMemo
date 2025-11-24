import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Member } from './entities/member.entity';


@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member)
    private membersRepository: Repository<Member>,
  ) {}

  //새 멤버 생성 POST /members
  create(createMemberDto: CreateMemberDto) {
    return this.membersRepository.save(createMemberDto); //DB에 저장
  }

  //모든 멤버 조회 GET /members
  findAll() {
    return this.membersRepository.find(); //members 테이블에서 모든 데이터를 찾는다
  }

  //멤버 1개 상세조회 GET /members/:id
  async findOne(id: number) { //id 기준으로 1개의 데이터를 찾는다
    const member = await this.membersRepository.findOne({ where: { id } });
    if (!member) { //없으면 404 에러
      throw new NotFoundException(`Member with ID ${id} not found`);
    }
    return member;
  }

  //멤버 수정 PATCH /members/:id
  async update(id: number, updateMemberDto: UpdateMemberDto) {
    const member = await this.findOne(id); //먼저 존재 여부 확인
    Object.assign(member, updateMemberDto); //전달받은 필드만 덮어쓰기
    return this.membersRepository.save(member); //DB에 저장
  }

  //멤버 삭제 DELETE /members/:id
  async remove(id: number) {
    const member = await this.findOne(id); //먼저 존재 여부 확인
    await this.membersRepository.remove(member); //DB에서 삭제
    return { message: '멤버가 성공적으로 삭제되었습니다.' };
 }
}