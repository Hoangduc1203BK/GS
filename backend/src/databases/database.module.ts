import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiConfigService } from 'src/core/shared/services/api-config.service';
import { SharedModule } from 'src/core/shared/shared.module';

@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule, SharedModule],
			inject: [ApiConfigService],
			useFactory: (configService: ApiConfigService) => ({
				type: 'postgres',
				host: configService.getDBConfig().host,
				port: configService.getDBConfig().port,
				username: configService.getDBConfig().username,
				password: configService.getDBConfig().password,
				database: configService.getDBConfig().database,
				synchronize: true,
				keepConnectionAlive: true,
				entities: ['./dist/src/databases/entities/index.{js,ts}'],
			}),
		}),
	],
	providers: [ApiConfigService],
	exports: [],
})
export class DatabaseModule {}
