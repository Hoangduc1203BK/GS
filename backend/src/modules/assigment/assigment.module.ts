import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Assigment, SubAssigment, UserClass } from "src/databases/entities";
import { AssigmentController } from "./assigment.controller";
import { AssigmentService } from "./assigment.service";
import { ClassModule, ClassService } from "../class";

@Module({
    imports: [
       TypeOrmModule.forFeature([Assigment, SubAssigment, UserClass]),
       forwardRef(() => ClassModule)
    ],
    controllers: [AssigmentController],
    providers: [AssigmentService],
    exports: [AssigmentService],
})
export class AssigmentModule{};