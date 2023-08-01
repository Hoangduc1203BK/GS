import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Assigment, Proposals, SubAssigment } from "src/databases/entities";
import { UserModule } from "../user";
import { ClassModule } from "../class";
import { ProposalController } from "./proposal.controller";
import { ProposalService } from "./proposal.service";
import { TeacherTakeBrake } from "./teacher-take-break.service";
import { TeacherRegisterClass } from "./teacher-register-class.service";
import { StudentRegisterClass } from "./student-register-class.service";
import { StudentTerminateClass } from "./student-terminate-class.service";
import { ProposalStrategy } from '../../common/interfaces/proposals';
import { MailService } from "src/core/shared/services/mail/mail.service";
import { AssigmentModule, AssigmentService } from "../assigment";
import { RedisCacheModule } from "src/core/redis/redis.module";
import { ProposalConsumer } from "./proposal.processor";
@Module({
    imports: [
        TypeOrmModule.forFeature([Proposals]),
        forwardRef(() => UserModule),
        forwardRef(() => ClassModule),
        forwardRef(() => AssigmentModule),
        forwardRef(() => RedisCacheModule),
    ],
    controllers: [ProposalController],
    providers: [ProposalService, TeacherTakeBrake,TeacherRegisterClass, StudentRegisterClass, StudentTerminateClass, MailService, ProposalConsumer],
    exports: [ProposalService]
})
export class ProposalModule{};