import { Module, forwardRef } from '@nestjs/common';
import { DepartmentController } from './department.controller';
import { DepartmentService } from './department.service';
import { Department, User } from 'src/databases/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule, UserService } from '../user';

@Module({
    imports: [
        TypeOrmModule.forFeature([Department, User]),
        forwardRef(() => UserModule)
    ],
    controllers: [DepartmentController],
    providers: [DepartmentService],
    exports: [DepartmentService],
})
export class DepartmentModule {}
