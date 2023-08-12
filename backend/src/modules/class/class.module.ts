import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Attendance, Classes, HistoryPrice, Room, SubAttendance, Subject, TimeTable, UserClass } from "src/databases/entities";
import { ClassController } from "./class.controller";
import { ClassService } from "./class.service";
import { SubjectModule, SubjectService } from "../subject";
import { UserModule, UserService } from "../user";
import { DepartmentModule } from "../department";

@Module({
    imports: [
        TypeOrmModule.forFeature([Classes, Room, TimeTable, Subject, UserClass, Attendance, SubAttendance, HistoryPrice]),
        forwardRef(() => UserModule),
        forwardRef(() => SubjectModule)
    ],
    controllers: [ClassController],
    providers: [ClassService],
    exports: [ClassService],
})
export class ClassModule{};