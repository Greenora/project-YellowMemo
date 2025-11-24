import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  //새 게시물 생성 로직 POST/posts
  async create(createPostDto: CreatePostDto, userId: number): Promise<Post>{
    const {title, contents, category} = createPostDto;

    // 새 post 엔티티 생성
    const newPost = this.postsRepository.create({
      title,
      contents,  // json 타입 컬럼에 배열 통째로 저장
      category, // 카테고리 추가
      userId,    // 토큰에서 넘어온 ID 저장
    });

    //DB에 저장
    await this.postsRepository.save(newPost);
    return newPost;
  }

  // 모든 게시물 조회  GET /posts
  async findAll(): Promise<Post[]> {  //posts 테이블에서 모든 데이터를 찾고
    return this.postsRepository.find({//user 관계(작성자 정보)를 join해서 같이 가져온다
      relations: ['user'],            //user 정보 중에 password-hash는 빼고 가져와야함! 통째로 가져오면 비밀버호가 딸려오니까
      select: {
        id: true,    //post.id
        title: true, //post.title
        createdAt: true, //post.createdAt
        user:{
          id: true,
          nickname: true,
          image_url: true, //프론트에서 프로필 사진에 쓸 image_url
        },
      },
      order: {
        createdAt: 'DESC', //최신순으로 정렬렬
      },
    });
  }

  // 게시물 1개 상세조회  GET /posts/:id
  async findOne(id: number): Promise<Post> { //id 기준으로 1개의 데이터를 찾는다
    const post= await this.postsRepository.findOne({ 
      where: {id: id},  
      relations: ['user'], //user 관계(작성자 정보)를 join해서 같이 가져온다다
      select: {            //비밀번호 해시는 빼고 contents를 포함함 상세정보니까
        id: true,
        title: true,
        contents: true,
        createdAt: true,
        updatedAt: true,
        userId: true,      //권한 체크를 위해 userId 포함
        user: {
          id: true,
          nickname: true,
          image_url: true,
        },
      },
    });
    
    if(!post) { // 만약 post가 null이면 (없는 게시물이면) 404 에러가 발생
      throw new NotFoundException(`post with ID "${id}" not found`)
    }
    return post;
    
  }

  //게시물 수정 PATCH /posts/:id
  async update(id: number, updatePostDto: UpdatePostDto, userId: number): Promise<Post> {//먼저 게시물이 있는지 찾는다 (findOne 로직 재사용)
     const post = await this.findOne(id); // 시물이 있는지 없는지 찾는다 findOne이 없으면 NotFoundException나옴

     if (post.userId !== userId) {  //권한 확인: 게시물의 주인과 토큰의 userid가 같은지?
      throw new ForbiddenException('수정 권한이 없습니다.'); //403 에러
     }
     const updatepost = Object.assign(post, updatePostDto); //통과하면 수정할 내용을 기존 post 객체에 덮어씀
     
     await this.postsRepository.save(updatepost); //db에 저장
     return updatepost  //수정된 post 반환
  }


  //게시물 삭제 DELETE /posts/:id
  async remove(id: number, userId: number): Promise<{message: string}> {//토큰에서 유저 id 가져오고 post객체 대신 성공 메세지 반환
    const post = await this.findOne(id); //게시물이 있는지 없는지 찾는다 findOne이 없으면 NotFoundException나옴

    if (post.userId !== userId){ //권한 확인: 게시물의 주인과 토큰이 userid가 같은지?
      throw new ForbiddenException('삭제 권한이 없습니다.'); //403 에러
    }

    await this.postsRepository.remove(post); //db에서 이 게시물을 삭제
    return{message: '삭제되었습니다.'} //성공 메세지 반환
  }
}
