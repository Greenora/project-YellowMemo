import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "src/users/entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    //토큰 검사기
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {
        super({
            secretOrKey: 'YOUR_SECRET_KEY',  //auth.module.ts의 비밀키와 똑같아야 함
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //토큰을 'Bearer' 헤더에서 찾음
        });
    }

    //검사 로직( 토큰이 유효할 때만 실행됨)
    async validate(payload: {username: string; sub: number}): Promise<User>{
        const {username} = payload;
        const user = await this.userRepository.findOne({
            where: {username},
        });

        if (!user) { //유저가 없으면 에러
            throw new UnauthorizedException();
        }
        return user; //유저 정보를 req.user에 저장
    }
}