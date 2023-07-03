import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './../../databases/database.module';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from 'src/core/shared/shared.module';
import { ApiConfigService } from 'src/core/shared/services';
import { Auth, User } from 'src/databases/entities';
import { JwtStrategy, LocalStrategy } from './strategy';
import { BcryptService } from '../user/bcrypt.service';

@Module({
	imports: [
		DatabaseModule,
		PassportModule,
		JwtModule.registerAsync({
			imports: [ConfigModule, SharedModule],
			useFactory: (configService: ApiConfigService) => ({
				secret: configService.getAuthConfig().secretKey,
				signOptions: {
					expiresIn: `${configService.getAuthConfig().expiresTime}s`,
				},
			}),
			inject: [ApiConfigService],
		}),
		TypeOrmModule.forFeature([User, Auth]),
	],
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy, LocalStrategy, BcryptService],
	exports: [],
})
export class AuthModule {}