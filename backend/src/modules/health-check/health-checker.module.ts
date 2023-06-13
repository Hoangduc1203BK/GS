import { Module } from '@nestjs/common';

import { HealthCheckerController } from './health-checker.controller';
import { SharedModule } from 'src/core/shared/shared.module';

@Module({
	imports: [SharedModule],
	controllers: [HealthCheckerController],
})
export class HealthCheckerModule {}
