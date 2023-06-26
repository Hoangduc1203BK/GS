import { Module } from '@nestjs/common';
import { DepartmentController } from './department.controller';
import { DepartmentService } from './department.service';
import { Department } from 'src/databases/entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([Department])],
    controllers: [DepartmentController],
    providers: [DepartmentService],
    exports: [],
})
export class DepartmentModule {}
