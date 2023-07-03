import { ApiConfigService } from 'src/core/shared/services/api-config.service';
import { AuthService } from './auth.service';
import { JwtAuthGuard, LocalAuthGuard } from 'src/core/guards';
import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller('/auth')
export class AuthController {
	constructor(private readonly authService: AuthService, private readonly configService: ApiConfigService) {}

	@UseGuards(LocalAuthGuard)
	@Post('/login')
	async login(@Req() req: Request, @Res() res: Response) {
        const { user } = req;
		const result = await this.authService.login(user);
		const expiresTime = this.configService.getAuthConfig().refreshTime * 24 * 60 * 60 * 1000;
		res.cookie('refresh_token', result.refreshToken, {
			maxAge: expiresTime,
			httpOnly: true,
		});

		res.json(result);
	}

	@UseGuards(JwtAuthGuard)
	@Get('/me')
	async getMe(@Req() req: Request): Promise<Express.User> {
		return req['user'];
	}

	@Post('/refresh-token')
	async refreshToken(@Req() req: Request, @Res() res: Response) {
		const refreshToken = req['headers'].cookie.substring(14) || '';
		const result = await this.authService.refreshToken(refreshToken);

		const expiresTime = this.configService.getAuthConfig().refreshTime * 24 * 60 * 60 * 1000;
		res.cookie('refresh_token', result.refreshToken, {
			maxAge: expiresTime,
			httpOnly: true,
		});

		res.json(result);
	}

	@Post('/logout')
	async logOut(@Req() req: Request, @Res() res: Response) {
		const refreshToken = req['headers'].cookie.substring(14) || '';
		await this.authService.logOut(refreshToken);
		res.clearCookie('refresh_token');

		return res.json(true);
	}

	@Post('/reset-password')
	async resetPassword(@Body('email') email: string) {
		await this.authService.resetPassword(email);

		return true;
	}
}
