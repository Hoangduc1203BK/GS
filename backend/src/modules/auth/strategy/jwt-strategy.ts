import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { JwtService } from '@nestjs/jwt';
import { ApiConfigService } from 'src/core/shared/services';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly configService: ApiConfigService,
		private readonly authService: AuthService,
		private readonly jwtService: JwtService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.getAuthConfig().secretKey,
		  });
	}

	async validate(payload: any) {
		const { sub, email } = payload;
		const user = await this.authService.validateJWT(sub, email);

		if (!user) {
			throw new UnauthorizedException('Unauthorized');
		}

		return user;
	}
}