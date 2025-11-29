import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { User } from 'src/users/entities/user.entity';
import { Post } from 'src/posts/entities/post.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,

    @InjectRepository(Post) //진짜 post가 있는지 확인하기 위해 post Repository도 추가가
    private postsRepository: Repository<Post>,
  ){}

  //새 댓글 생성 POST /posts/:postId/comments
  async create(createCommentDto: CreateCommentDto, postId: number, userId: number): Promise<Comment>{  //어느 게시물에 누가 썼는지??
    const { text, x, y } = createCommentDto;

    const post = await this.postsRepository.findOne({ where: { id:postId} }); //게시물이 진짜 존재하는지 확인한다
    if (!post) {
      throw new NotFoundException(`post with ID "${postId}" not found`);
    }

    //새 댓글 엔티티 생성
    const newComment = this.commentsRepository.create({
      text,
      x,
      y,
      postId, //게시물 id저장
      userId, //작성자 id 저장
    });


    //db에 저장
    await this.commentsRepository.save(newComment);
    return newComment;
  } 



  //특정 게시물의 모든 댓글 조회
  async findAllByPostId(postId: number): Promise<Comment[]> { //postid로 모든 댓글을 찾음
    return this.commentsRepository.find({  
      where: {postId: postId}, //user관계(작성자 정보)를 join해서 같이 갖고옴
      relations: ['user'], //user 정보 중 password_hash는 빼고 가져온다!!!!!!!!!!!!!!!!!!!!!1
      select: {
        id: true,
        text : true,
        x: true,
        y: true,
        createdAt: true,
        user: {
          id: true,
          nickname: true,
          image_url: true,
        },
      },
      order: {
        createdAt: 'ASC'  //오래된 순으로 정렬
      },
    });
  }

  //댓글 1개 조회 (나중에 필요할까봐)
  async findOne(id: number): Promise<Comment> {
    const comment = await this.commentsRepository.findOne({
      where: {id},
    });
    if (!comment) {
      throw new NotFoundException(`Comment with ID "${id}" not found`);
    }
    return comment;
  }

  //댓글 수정 PATCH /posts/:postId/comments/:id
  async update(id: number, updateCommentDto: UpdateCommentDto, userId: number): Promise<Comment> {
    const comment = await this.findOne(id); //댓글이 있는지 찾음

    //권한 확인: 댓글 주인과 토큰 주인의 userid가 같은지?
    if (comment.userId !== userId) {
      throw new ForbiddenException('수정 권한이 없습니다.') //403에러
    }
    const updateComment = Object.assign(comment, updateCommentDto); //통과 시 수정할 내용을 기존 comment 객체에 덮어씀

    return this.commentsRepository.save(updateComment); //db에 저장
  }

  async remove(id: number, userId: number): Promise<{ message: string}> {
    const comment = await this.findOne(id); //댓글이 있는지 찾음

    //권한 확인: 댓글 주인과 토큰 주인의 userid가 같나?
    if (comment.userId !== userId) { 
      throw new ForbiddenException('삭제 권한이 없습니다.') //403 에러
    }
    
    //통과 시 db에서 이 댓글을 삭제
    await this.commentsRepository.remove(comment);
    return { message: '댓글이 삭제되었습니다.'};
  }
}
