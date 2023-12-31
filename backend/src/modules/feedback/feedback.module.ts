import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Feedback } from "src/databases/entities";
import { UserModule } from "../user";
import { ClassModule } from "../class";
import { FeedbackController } from "./feedback.controller";
import { FeedbackService } from "./feedback.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Feedback]),
        forwardRef(() => UserModule),
        forwardRef(() => ClassModule),
    ],
    controllers: [FeedbackController],
    providers: [FeedbackService],
    exports: [FeedbackService],
})
export class FeedbackModule{}