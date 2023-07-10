import { Injectable } from "@nestjs/common";
import { ProposalStrategy } from "src/common/interfaces/proposals";
import { UpdateProposalDto } from "./dto/update-proposal.dto";
import { Proposals } from "src/databases/entities";
import { PROPOSAL_STATUS, USER_CLASS_TYPE } from "src/common/constants";
import { ClassService } from "../class";
import { MailService } from "src/core/shared/services/mail/mail.service";
import { UserService } from "../user";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class StudentRegisterClass implements ProposalStrategy {
    constructor(
        @InjectRepository(Proposals) private readonly proposalRepos: Repository<Proposals>,
        private readonly classService: ClassService,
        private readonly mailService: MailService,
        private readonly userService: UserService,
    ) {}
    async handleProposal(dto: UpdateProposalDto, proposal: Proposals) {
        switch (dto.status) {
            case PROPOSAL_STATUS.APPROVED:
                await this.approved(proposal);
                break;
            case PROPOSAL_STATUS.REJECTED:
                await this.rejected(proposal)
                break;
            case PROPOSAL_STATUS.CANCELED:
                await this.canceled(proposal);
                break;
        }
    }

    async approved(proposal: Proposals) {
        const { subData } = proposal;
        const classes = await this.classService.getClass(subData.classId);
        const user = await this.userService.getUser(proposal.userId);
        const doc = {
            userId: proposal.userId,
            classId: subData.classId,
            type: USER_CLASS_TYPE.MAIN,
        }

        await this.classService.createUserClass(doc);

        const updateProposal = {
            ...proposal,
            status: PROPOSAL_STATUS.APPROVED,
        }

        await this.proposalRepos.save({id: proposal.id, ...updateProposal})

        // gửi mail về giáo viên chủ nhiệm lớp
        await this.mailService.sendMail(
            classes.user.email,
            'Kết quả xét duyệt đề xuất',
            './proposal',
            {
                name: 'đăng ký lớp',
                status: PROPOSAL_STATUS.APPROVED,
                description: 'Học sinh ' + user.name+ ' đã được thêm vào lớp:' + classes.name + ' .'
            }
        )

        // gửi mail về phụ huynh và học sinh
        await this.mailService.sendMail(
            user.email,
            'Kết quả xét duyệt đề xuất',
            './proposal',
            {
                name: 'đăng ký lớp',
                status: PROPOSAL_STATUS.APPROVED,
                description: 'Đề xuất đăng ký lớp có id:' + proposal.subData.classId + ' đã được phê duyệt.'
            }
        )
    }

    async rejected(proposal: Proposals) {
        const doc = {
            ...proposal,
            status: PROPOSAL_STATUS.REJECTED,
        }
        
        await this.proposalRepos.save({id: proposal.id, ...doc});
        const user = await this.userService.getUser(proposal.userId);
        await this.mailService.sendMail(
            user.email,
            'KẾT QUẢ XÉT DUYỆT ĐỀ XUẤT',
            './proposal',
            {
                name: 'đăng ký lớp',
                status: PROPOSAL_STATUS.REJECTED,
                description: 'Đề xuất đăng ký học lớp có id:' + proposal.subData.classId + ' chưa được phê duyệt.\n Mọi ý kiến đóng góp xin vui lòng liên hệ về quản lý trung tâm.'
            }
        )
    }

    async canceled(proposal: Proposals) {
        const doc = {
            ...proposal,
            status: PROPOSAL_STATUS.CANCELED,
        }
        
        await this.proposalRepos.save({id: proposal.id, ...doc});
        const user = await this.userService.getUser(proposal.userId);
        await this.mailService.sendMail(
            user.email,
            'KẾT QUẢ XÉT DUYỆT ĐỀ XUẤT',
            './proposal',
            {
                name: 'đăng ký lóp',
                status: PROPOSAL_STATUS.CANCELED,
                description: 'Đề xuất đăng ký học lớp có id:' + proposal.subData.classId + ' đã bị huỷ.\n Mọi ý kiến đóng góp xin vui lòng liên hệ về quản lý trung tâm.'
            }
        )
    }
}