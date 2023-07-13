import { Injectable } from "@nestjs/common";
import { ProposalStrategy } from "src/common/interfaces/proposals";
import { UpdateProposalDto } from "./dto/update-proposal.dto";
import { Proposals } from "src/databases/entities";
import { PROPOSAL_STATUS } from "src/common/constants";
import { InjectRepository } from "@nestjs/typeorm";
import { UserService } from "../user";
import { MailService } from "src/core/shared/services/mail/mail.service";
import { ClassService } from "../class";
import { Repository } from "typeorm";

@Injectable()
export class TeacherTakeBrake implements ProposalStrategy {
    constructor(
        @InjectRepository(Proposals) private readonly proposalRepos: Repository<Proposals>,
        private readonly userService: UserService,
        private readonly mailService: MailService,
        private readonly classService: ClassService,
    ) {}
    async handleProposal(dto: UpdateProposalDto, proposal: Proposals, subDataDto: string) {
        switch (dto.status) {
            case PROPOSAL_STATUS.APPROVED:
                await this.approved(proposal, subDataDto);
                break;
            case PROPOSAL_STATUS.REJECTED:
                await this.rejected(proposal)
                break;
            case PROPOSAL_STATUS.CANCELED:
                await this.canceled(proposal)
                break;
        }
    }

    async approved(proposal: Proposals, subDataDto: any) {
        await this.userService.getUser(subDataDto.teacherId);
        const {subData, ...rest} = proposal;
        // subData.subTeacherId = subDataDto.teacherId;
    }

    async rejected(proposal: Proposals) {}

    async canceled(proposal: Proposals) {

    }
}