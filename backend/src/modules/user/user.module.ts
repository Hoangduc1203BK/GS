import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance, Department, SubAttendance, Subject, User } from 'src/databases/entities';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { DepartmentModule, DepartmentService } from '../department';
import { BcryptService } from './bcrypt.service';
import { SubjectModule } from '../subject';
import { AuthModule } from '../auth/auth.module';
import { ClassModule } from '../class';

@Module({
  imports: [
    TypeOrmModule.forFeature([Department, User, Subject, Attendance, SubAttendance]),
    forwardRef(() => DepartmentModule),
    forwardRef(() => ClassModule),
  ],
  controllers: [UserController],
  providers: [UserService, BcryptService],
  exports: [UserService],
})
export class UserModule {}
