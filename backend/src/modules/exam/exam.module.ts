import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Attendance, Classes, Exam, Room, SubExam, Subject, TimeTable, User, UserClass } from "src/databases/entities";
import { ExamController } from "./exam.controller";
import { ExamService } from "./exam.service";
import { UserModule, UserService } from "../user";
import { GeneratorService } from "src/core/shared/services";
import { ClassModule, ClassService } from "../class";
import { SubjectModule } from "../subject";
import { RedisCacheModule } from "src/core/redis/redis.module";
import { ExamConsumer } from "./exam.processor";

@Module({
    imports: [
        TypeOrmModule.forFeature([Exam, SubExam]),
        forwardRef(() => UserModule),
        forwardRef(() => ClassModule),
        forwardRef(() => SubjectModule),
        forwardRef(() => RedisCacheModule),
    ],
    controllers: [ExamController],
    providers: [ExamService, ExamConsumer, GeneratorService],
    exports: [ExamService],
})
export class ExamModule{};