import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Department, User } from "src/databases/entities";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { DepartmentService } from "../department";

@Module({
    imports: [TypeOrmModule.forFeature([Department, User])],
    controllers: [UserController],
    providers: [UserService, DepartmentService],
    exports: [UserService],
})
export class UserModule{};