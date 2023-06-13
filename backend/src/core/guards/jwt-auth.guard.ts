import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import * as jwt from 'jsonwebtoken';
import { ApiConfigService } from '../shared/services/api-config.service';
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
	constructor(
		private readonly configService: ApiConfigService,
		// private readonly authService: AuthService,
		private readonly jwtService: JwtService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.getAuthConfig().secretKey,
		});
	}
	async canActivate(context: ExecutionContext) {
		const req = context.switchToHttp().getRequest();
		const token = req.headers['authorization']?.split(' ')[1];
		try {
			// const decoded = jwt.verify(token, 'thisisasamplesecret');
			// const user = await this.authService.validateJWT(decoded.sub as string, decoded['email']);

			// if (!user) {
			// 	throw new UnauthorizedException('Unauthorized');
			// }

			// req.user = user;
			return true;
		} catch (error) {
			throw error;
		}
	}
}
