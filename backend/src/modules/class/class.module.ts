import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Classes, Room, Subject, TimeTable, UserClass } from "src/databases/entities";
import { ClassController } from "./class.controller";
import { ClassService } from "./class.service";
import { SubjectModule, SubjectService } from "../subject";
import { UserModule, UserService } from "../user";
import { DepartmentModule } from "../department";

@Module({
    imports: [
        TypeOrmModule.forFeature([Classes, Room, TimeTable, Subject, UserClass]),
        forwardRef(() => UserModule),
        forwardRef(() => SubjectModule)
    ],
    controllers: [ClassController],
    providers: [ClassService],
    exports: [],
})
export class ClassModule{};