import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from './core/shared/shared.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './databases/database.module';
import { DepartmentModule } from './modules/department/department.module';
import { MODULES } from './modules';

@Module({
  imports: [
    ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: '.env',
		}),
    DatabaseModule,
    SharedModule,
    ...MODULES
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
