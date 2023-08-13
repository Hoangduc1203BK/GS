import { Injectable } from "@nestjs/common";
import { ProposalStrategy } from "src/common/interfaces/proposals";
import { UpdateProposalDto } from "./dto/update-proposal.dto";
import { PROPOSAL_STATUS } from "src/common/constants";
import { Proposals } from "src/databases/entities";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { MailService } from "src/core/shared/services/mail/mail.service";
import { UserService } from "../user";
import { ClassService } from "../class";

@Injectable()
export class TeacherRegisterClass implements ProposalStrategy {
    constructor(
        @InjectRepository(Proposals) private readonly proposalRepos: Repository<Proposals>,
        private readonly userService: UserService,
        private readonly mailService: MailService,
        private readonly classService: ClassService,
    ) { }

    async handleProposal(dto: UpdateProposalDto, proposal: Proposals) {
        switch (dto.status) {
            case PROPOSAL_STATUS.APPROVED:
                await this.approved(proposal);
                break;
            case PROPOSAL_STATUS.REJECTED:
                await this.rejected(proposal);
                break;
            case PROPOSAL_STATUS.CANCELED:
                await this.canceled(proposal);
                break;
        }
    }

    async approved(proposal: Proposals) {
        const { subData } = proposal;
        const proposals = await this.proposalRepos.find({
            where: {
                subData: subData
            }
        })

        const doc = {
            ...proposal,
            status: PROPOSAL_STATUS.APPROVED,
        }

        await this.proposalRepos.save({ id: proposal.id, ...doc })

        const listProposalReject = proposals.filter(el => el.userId != proposal.userId);
        if(listProposalReject.length>0) {
            for (const p of listProposalReject) {
                const item = {
                    ...p,
                    status: PROPOSAL_STATUS.REJECTED,
                }
    
                await this.proposalRepos.save({ id: p.id, ...item })
            }
        }

        await this.classService.updateClass(subData.classId, {teacher: proposal.userId })

        const user = await this.userService.getUser(proposal.userId);

        await this.mailService.sendMail(
            user.email,
            'Kết quả xét duyệt đề xuất',
            './proposal',
            {
                name: 'đăng ký dạy lớp',
                status: PROPOSAL_STATUS.APPROVED,
                description: 'Đề xuất đăng ký lớp có id:' + proposal.subData.classId + ' đã được phê duyệt.'
            }
        )

        if(listProposalReject.length >0) {
            for (const p of listProposalReject) {
                const teacher = await this.userService.getUser(p.userId)
                await this.mailService.sendMail(
                    teacher.email,
                    'Kết quả xét duyệt đề xuất',
                    './proposal',
                    {
                        name: 'đăng ký dạy lớp',
                        status: PROPOSAL_STATUS.REJECTED,
                        description: 'Đề xuất đăng ký lớp có id:' + proposal.subData.classId + ' chưa được phê duyệt.\n Mọi ý kiến đóng góp xin vui lòng liên hệ về quản lý trung tâm.'
                    }
                )
            }
        }
    }

    async rejected(proposal: Proposals) {
        const doc = {
            ...proposal,
            status: PROPOSAL_STATUS.REJECTED,
        }

        await this.proposalRepos.save({ id: proposal.id, ...doc })
        const user = await this.userService.getUser(proposal.userId);

        await this.mailService.sendMail(
            user.email,
            'KẾT QUẢ XÉT DUYỆT ĐỀ XUẤT',
            './proposal',
            {
                name: 'đăng ký dạy lớp',
                status: PROPOSAL_STATUS.REJECTED,
                description: 'Đề xuất đăng ký lớp có id:' + proposal.subData.classId + ' chưa được phê duyệt.\n Mọi ý kiến đóng góp xin vui lòng liên hệ về quản lý trung tâm.'
            }
        )
    }

    async canceled(proposal: Proposals) {
        const doc = {
            ...proposal,
            status: PROPOSAL_STATUS.CANCELED,
        }

        await this.proposalRepos.save({ id: proposal.id, ...doc })
        const user = await this.userService.getUser(proposal.userId);

        await this.mailService.sendMail(
            user.email,
            'KẾT QUẢ XÉT DUYỆT ĐỀ XUẤT',
            './proposal',
            {
                name: 'đăng ký dạy lớp',
                status: PROPOSAL_STATUS.CANCELED,
                description: 'Đề xuất đăng ký lớp có id:' + proposal.subData.classId + ' đã bị huỷ.\n Mọi ý kiến đóng góp xin vui lòng liên hệ về quản lý trung tâm.'
            }
        )
    }
}