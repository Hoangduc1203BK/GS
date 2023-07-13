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
        const updateSubData = {
            ...subData,
            subTeacherId: subDataDto.teacherId
        }

        const doc = {
            ...rest,
            status: PROPOSAL_STATUS.APPROVED,
            subData: updateSubData,
        }

        await this.proposalRepos.save({id: proposal.id, ...doc});
        const classes = await this.classService.updateClass(subData.classId, {teacherOfDay: subDataDto.teacherId})

        const teacher = await this.userService.getUser(proposal.userId);
        const subTeacher = await this.userService.getUser(subDataDto.teacherId);

        await this.mailService.sendMail(
            teacher.email,
            'Kết quả xét duyệt đề xuất',
            './proposal',
            {
                name: 'xin nghỉ dạy lớp',
                status: PROPOSAL_STATUS.APPROVED,
                description: 'Đề xuất xin nghỉ dạy lớp có id:' + proposal.subData.classId + ' đã được phê duyệt. Giáo viên ' + subTeacher.name + ' sẽ được đề xuất dạy thay lớp '+ classes.name + ' ngày ' + proposal.time+ '.'
            }
        )

        await this.mailService.sendMail(
            subTeacher.email,
            'Kết quả xét duyệt đề xuất',
            './proposal',
            {
                name: 'dạy thay lớp',
                status: PROPOSAL_STATUS.APPROVED,
                description: 'Bạn được trung tâm đề xuất dạy thay lớp '+ classes.name + ' ngày ' + proposal.time+ '.'
            }
        )
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
                name: 'xin nghỉ dạy lớp',
                status: PROPOSAL_STATUS.REJECTED,
                description: 'Đề xuất xin nghỉ dạy lớp có id:' + proposal.subData.classId + ' đã được phê duyệt.\n Mọi ý kiến đóng góp xin vui lòng liên hệ về quản lý trung tâm.'
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
                name: 'xin nghỉ dạy lớp',
                status: PROPOSAL_STATUS.CANCELED,
                description: 'Đề xuất xin nghỉ dạy lớp có id:' + proposal.subData.classId + ' đã bị huỷ.\n Mọi ý kiến đóng góp xin vui lòng liên hệ về quản lý trung tâm.'
            }
        )
    }
}