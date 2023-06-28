import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Department, Subject } from "src/databases/entities";
import { SubjectController } from "./subject.controller";
import { SubjectService } from "./subject.service";
import { DepartmentService } from "../department/department.service";
import { UserModule } from "../user";

@Module({
    imports:[
        TypeOrmModule.forFeature([Subject, Department]),
        forwardRef(() => UserModule)
    ],
    controllers: [SubjectController],
    providers: [SubjectService, DepartmentService],
    exports: [SubjectService]
})
export class SubjectModule{}