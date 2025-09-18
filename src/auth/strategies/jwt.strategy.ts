import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from 'src/auth/common/';
import { AppConfig } from 'src/config/config.schema';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private readonly configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: AppConfig.JWT_SECRET,
        });
    }

    async validate(payload: JwtPayload) {
        console.log('JWT payload:', payload);
        let user = {
            id: payload.id as number,
            userType: payload.userType,
        };

        return user;
    }
}
