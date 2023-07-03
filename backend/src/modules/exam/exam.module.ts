import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Attendance, Classes, Exam, ExamResult, RegisterExam, Room, SubExam, Subject, TimeTable, User, UserClass } from "src/databases/entities";
import { ExamController } from "./exam.controller";
import { ExamService } from "./exam.service";
import { UserModule, UserService } from "../user";
import { GeneratorService } from "src/core/shared/services";
import { ClassModule, ClassService } from "../class";
import { SubjectModule } from "../subject";

@Module({
    imports: [
        TypeOrmModule.forFeature([Exam, SubExam, ExamResult, RegisterExam]),
        forwardRef(() => UserModule),
        forwardRef(() => ClassModule),
        forwardRef(() => SubjectModule),
    ],
    controllers: [ExamController],
    providers: [ExamService, GeneratorService],
    exports: [ExamService],
})
export class ExamModule{};