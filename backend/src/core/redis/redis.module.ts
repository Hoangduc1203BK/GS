import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigModule } from '@nestjs/config';
import { ApiConfigService } from '../shared/services/api-config.service';
import { QUEUE_JOB } from 'src/common/constants';

@Module({
	imports: [
		BullModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ApiConfigService],
			useFactory: (configService: ApiConfigService) => ({
				redis: {
					host: configService.getRedisConfig().host,
					port: configService.getRedisConfig().port,
				},
			}),
		}),
		BullModule.registerQueue(
			{
				name: QUEUE_JOB.SEND_MAIL,
			},
		),
	],
	controllers: [],
	providers: [],
	exports: [BullModule],
})
export class RedisCacheModule {}
