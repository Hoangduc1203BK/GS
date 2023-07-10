import { Injectable } from "@nestjs/common";
import { ProposalStrategy } from "src/common/interfaces/proposals";
import { UpdateProposalDto } from "./dto/update-proposal.dto";

@Injectable()
export class TeacherTakeBrake implements ProposalStrategy {
    async handleProposal(dto: UpdateProposalDto) {
        console.log('TeacherTakeBrake')
    }
}