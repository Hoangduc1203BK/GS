import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Exam, TestLearning } from "src/databases/entities";
import { TestLearningController } from "./test-learning.controller";
import { TestLearningService } from "./test-learning.service";
import { ClassModule } from "../class";
import { UserModule } from "../user";
import { Subject } from "rxjs";
import { SubjectModule } from "../subject";
@Module({
    imports: [
        TypeOrmModule.forFeature([TestLearning, Exam]),
        forwardRef(() => ClassModule),
        forwardRef(() => UserModule),
        // forwardRef(() => SubjectModule),
    ],
    controllers: [TestLearningController],
    providers: [TestLearningService],
    exports: [TestLearningService]
})
export class TestLearningModule { };