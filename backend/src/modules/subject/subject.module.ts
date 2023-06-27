import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Department, Subject } from "src/databases/entities";
import { SubjectController } from "./subject.controller";
import { SubjectService } from "./subject.service";
import { DepartmentService } from "../department/department.service";

@Module({
    imports:[TypeOrmModule.forFeature([Subject, Department])],
    controllers: [SubjectController],
    providers: [SubjectService, DepartmentService],
    exports: [SubjectService]
})
export class SubjectModule{}