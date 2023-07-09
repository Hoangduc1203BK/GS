import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Proposals } from "src/databases/entities";
import { UserModule } from "../user";
import { ClassModule } from "../class";
import { ProposalController } from "./proposal.controller";
import { ProposalService } from "./proposal.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Proposals]),
        forwardRef(() => UserModule),
        forwardRef(() => ClassModule),
    ],
    controllers: [ProposalController],
    providers: [ProposalService],
    exports: [ProposalService]
})
export class ProposalModule{};