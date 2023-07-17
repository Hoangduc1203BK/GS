import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Proposals } from "src/databases/entities";
import { Repository } from "typeorm";
import { ListProposalDto } from "./dto/list-proposal.dto";
import { DEFAULT_PAGING } from "src/common/constants/paging";
import { UserService } from "../user";
import { CLASS_TYPE, PROPOSAL_STATUS, PROPOSAL_TYPE, ROLE, USER_CLASS_TYPE } from "src/common/constants";
import { CreateProposalDto } from "./dto/create-proposal.dto";
import { ClassService } from "../class";
import { ProposalStrategy } from "src/common/interfaces/proposals";
import { TeacherRegisterClass } from "./teacher-register-class.service";
import { TeacherTakeBrake } from "./teacher-take-break.service";
import { StudentRegisterClass } from "./student-register-class.service";
import { StudentTerminateClass } from "./student-terminate-class.service";
import { UpdateProposalDto } from "./dto/update-proposal.dto";
import { MailService } from "src/core/shared/services/mail/mail.service";


@Injectable()
export class ProposalService {
    private proposalStrategy: ProposalStrategy
    constructor(
        @InjectRepository(Proposals) private readonly proposalRepos: Repository<Proposals>,
        private readonly userService: UserService,
        private readonly classService: ClassService,
        private readonly mailService: MailService
    ) { }

    setProposalStrategy(type: string) {
        switch (type) {
            case PROPOSAL_TYPE.TEACHER_REGISTER_CLASS:
                this.proposalStrategy = new TeacherRegisterClass(this.proposalRepos, this.userService, this.mailService, this.classService);
                break;
            case PROPOSAL_TYPE.TEACHER_TAKE_BRAKE:
                this.proposalStrategy = new TeacherTakeBrake(this.proposalRepos, this.userService, this.mailService, this.classService);
                break;
            case PROPOSAL_TYPE.STUDENT_REGISTER_CLASS:
                this.proposalStrategy = new StudentRegisterClass(this.proposalRepos, this.classService, this.mailService, this.userService);
                break;
            case PROPOSAL_TYPE.STUDENT_TERMINATE_CLASS:
                this.proposalStrategy = new StudentTerminateClass(this.proposalRepos, this.classService, this.mailService, this.userService);
            default:
                break;
        }
    }

    async listProposal(role: string, dto: ListProposalDto) {
        const current = new Date();
        let month = current.getMonth() + 1;
        const year = current.getFullYear();
        const lastDay = new Date(year, month + 1, 0);
        let formatMonth = month <= 9 ? `0${month}` : month.toString();
        const startDate = `${year}-${formatMonth}-01`;
        const endDate = `${year}-${formatMonth}-${lastDay.getDate()}`;
        const { page = DEFAULT_PAGING.PAGE, size = DEFAULT_PAGING.LIMIT, start = startDate, end = endDate, ...rest } = dto;
        if (dto.userId) {
            await this.userService.getUser(dto.userId)
        }

        let paramArr = [` p."time" >= '${start}' `, ` p."time" <= '${end}' `];

        for (const [k, v] of Object.entries(rest)) {
            if (k == "userId") {
                paramArr.push(' p.user_id = ' + `'` + v + `'`)
            }
            else {
                paramArr.push(' p."' + k + `" = '` + v + `'`)
            }
        }
        if (role == ROLE.TEACHER) {
            let qr = 'select p.*, u.name as user, u.email as email, d.id as department_id from proposals p, users u, departments d where p.user_id=u.id and u.department_id=d.id';
            if (paramArr.length > 0) {
                qr = qr + ' AND ' + paramArr.join(' AND ')
            }

            const skip = (page - 1) * size;
            qr += ` limit ${size} offset ${skip}`;

            const result = await this.proposalRepos.query(qr);

            return result;
        }else {
            let qr = 'select p.*, u.name as user, u.email as email from proposals p, users u where p.user_id=u.id';
            if (paramArr.length > 0) {
                qr = qr + ' AND ' + paramArr.join(' AND ')
            }

            const skip = (page - 1) * size;
            qr += ` limit ${size} offset ${skip}`;

            const result = await this.proposalRepos.query(qr);

            return result;
        }

    }

    async getProposal(id: number) {
        const proposal = await this.proposalRepos.findOne({
            where: {
                id: id
            },
            relations: ['user', 'user.department']
        })

        if (!proposal) {
            throw new Error('Không tìm thấy đề xuất với id:' + id);
        }

        const { user, subData, ...rest } = proposal;
        const classes = await this.classService.getClass(proposal.subData.classId);

        const doc = {
            ...rest,
            subData: {
                ...subData,
                className: classes.name,
                subject: classes.subject.name,
            },
            user: user.name,
            phoneNumber: user.phoneNumber,
            departmentId: user.role == ROLE.TEACHER ? user.department.id : null,
        }

        return doc;
    }

    async createProposal(dto: CreateProposalDto) {
        const user = await this.userService.getUser(dto.userId);
        const { classId } = dto.subData;
        await this.classService.getClass(classId);

        if (user.role == ROLE.TEACHER && dto.type == PROPOSAL_TYPE.TEACHER_REGISTER_CLASS) {
            const schedules = await this.classService.listTimeTable(dto.subData.classId);
            const mapSchedules = schedules.map(el => {
                return {
                    date: el.date,
                    roomId: el.roomId,
                    start: (el.start).toString(),
                    end: (el.end).toString(),
                }
            })
            const listTeacherEmpty = await this.classService.listTeacherEmpty({ schedules: mapSchedules });
            const existUser = listTeacherEmpty.find(el => el.id == dto.userId);
            if (!existUser) {
                throw new Error('Lớp ' + dto.subData.classId + ' có lịch trùng với lịch dạy đang có nên không thể tạo đề xuất')
            }
        } else if (user.role == ROLE.USER && dto.type == PROPOSAL_TYPE.STUDENT_REGISTER_CLASS) {
            const classes = await this.classService.getClass(dto.subData.classId);
            const listUserInClass = await this.classService.listUserInClass(dto.subData.classId, USER_CLASS_TYPE.MAIN);
            if (listUserInClass.length >= classes.numberStudent) {
                throw new Error('Lớp có id:' + dto.subData.classId + ' đã đầy chỗ, vui lòng chọn đăng ký lớp khác')
            }
        }

        const doc = {
            ...dto,
            status: PROPOSAL_STATUS.PENDING,
        }

        const result = await this.proposalRepos.save(doc);
        console.log(result)

        return this.getProposal(result.id);
    }

    async updateProposal(id: number, dto: UpdateProposalDto) {
        const proposal = await this.proposalRepos.findOne({ where: { id } });

        if (!proposal) {
            throw new Error("Không tìm thấy đề xuất với id:" + id);
        }

        if (proposal.status != PROPOSAL_STATUS.PENDING) {
            throw new Error('Đề xuất này có trạng thái:' + proposal.status + ' và không thể sửa đổi');
        }

        this.setProposalStrategy(proposal.type);

        if (proposal.type == PROPOSAL_TYPE.TEACHER_TAKE_BRAKE) {
            await this.proposalStrategy.handleProposal(dto, proposal, dto.subData);
        } else {
            await this.proposalStrategy.handleProposal(dto, proposal);
        }

        return true;
    }
}