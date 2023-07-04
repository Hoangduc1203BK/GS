import { BcryptService } from '../user/bcrypt.service';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto } from './dto/login.dto';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Auth, User } from 'src/databases/entities';
import { JwtService } from '@nestjs/jwt';
import { ApiConfigService, GeneratorService } from 'src/core/shared/services';
import * as moment from 'moment';
import { UserService } from '../user';
// import { MailerService } from '@nestjs-modules/mailer';
@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(User)
		private userRepos: Repository<User>,
		@InjectRepository(Auth)
		private accountRepos: Repository<Auth>,
		private bcrytService: BcryptService,
		private readonly jwtService: JwtService,
		private readonly configService: ApiConfigService,
		private readonly generatorService: GeneratorService,
		// @Inject(forwardRef(() => UserService)) private readonly userService: UserService
		// private readonly mailService: MailerService,
	) { }

	async validateUser(loginDto: LoginDto) {
		const { email, password } = loginDto;
		const result = await this.userRepos.findOne({ where: { email: email } });
		if (result) {
			const compare = await this.bcrytService.compare(password, result.password);
			if (compare) {
				return result;
			}
		}
	}

	async validateJWT(id: string, email: string) {
		const result = await this.userRepos.findOne({ where: { email, id } });

		return result;
	}

	async login(data: any) {
		const payload = {
			sub: data.id,
			email: data.email,
			role: data.role,
		};

		const accessToken = this.jwtService.sign(payload);
		const refreshToken = this.jwtService.sign(payload, {
			expiresIn: moment().add(this.configService.getAuthConfig().refreshTime, 'days').unix(),
		});

		const doc = {
			type: 'refresh-token',
			token: refreshToken,
			expires: moment().add(this.configService.getAuthConfig().refreshTime, 'days').toDate(),
			userId: data.id,
		};
		console.log(doc);
		await this.accountRepos.save(doc);

		return { accessToken, refreshToken };
	}

	async refreshToken(refreshToken: string) {
		const decoded = this.jwtService.decode(refreshToken) as { sub: string; email: string; role: number };

		const { sub, email, role } = decoded;

		const token = await this.accountRepos.findOne({ where: { token: refreshToken } });
		if (token.blacklisted) {
			const tokens = await this.accountRepos.find({ where: { userId: sub, blacklisted: false } });
			await Promise.all(
				tokens.map(async el => {
					const doc = {
						...el,
						blacklisted: true,
					};
					await this.accountRepos.save({ id: doc.id, ...doc });
				}),
			);
			throw new Error('Token không hợp lệ');
		} else {
			await this.accountRepos.save({ id: token.id, ...token, blacklisted: true });
			const payload = {
				sub,
				email,
				role,
			};

			const newAccessToken = this.jwtService.sign(payload);
			const newRefreshToken = this.jwtService.sign(payload, {
				expiresIn: moment().add(this.configService.getAuthConfig().refreshTime, 'days').unix(),
			});

			const doc = {
				type: 'refresh-token',
				token: newRefreshToken,
				expires: moment().add(this.configService.getAuthConfig().refreshTime, 'days').toDate(),
				userId: sub,
			};
			await this.accountRepos.save(doc);

			return {
				accessToken: newAccessToken,
				refreshToken: newRefreshToken,
			};
		}
	}

	async logOut(refreshToken: string) {
		const token = await this.accountRepos.findOne({
			where: {
				token: refreshToken,
				blacklisted: false,
			},
		});

		if (!token) {
			throw new Error('Refresh token không hợp lệ');
		}

		await this.accountRepos.delete({
			token: refreshToken,
			blacklisted: false,
		});

		return true;
	}

	async resetPassword(email: string) {
		const user = await this.userRepos.findOne({ where: { email: email } });
		if (!user) {
			throw new Error('Không tìm thấy người dùng');
		}

		const newPassword = this.generatorService.randomString(10);
		const hashPassword = await this.bcrytService.hash(newPassword);
		const doc = {
			...user,
			password: hashPassword,
		};

		await this.userRepos.save({ id: user.id, ...doc });

		// await this.mailService.sendMail({
		// 	to: email,
		// 	subject: 'Reset password in account Master Management System',
		// 	template: './reset-password',
		// 	context: {
		// 		id: user.id,
		// 		password: newPassword,
		// 	},
		// });
	}
}
