import { Proposals } from "src/databases/entities"
import { UpdateProposalDto } from "src/modules/proposals/dto/update-proposal.dto"

export interface TEACHER_REGISTER_CLASS {
    classId: string
}

export interface STUDENT_REGISTER_CLASS {
    classId: string
}

export interface TEACHER_TAKE_BRAKE {
    classId?: string,
    sub_teacher_id?: string,
}

export interface STUDENT_TERMINATE_CLASS {
    classId: string
}

export interface ProposalStrategy {
   handleProposal(dto: UpdateProposalDto, proposal: Proposals): Promise<void>
}