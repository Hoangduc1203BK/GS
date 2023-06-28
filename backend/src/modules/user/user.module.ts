import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department, Subject, User } from 'src/databases/entities';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { DepartmentModule, DepartmentService } from '../department';
import { BcryptService } from './bcrypt.service';
import { SubjectModule } from '../subject';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Department, User, Subject]),
    forwardRef(() => DepartmentModule),
    // forwardRef(() => AuthModule),
  ],
  controllers: [UserController],
  providers: [UserService, BcryptService],
  exports: [UserService],
})
export class UserModule {}
