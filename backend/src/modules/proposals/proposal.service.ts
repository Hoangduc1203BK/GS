import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Proposals } from "src/databases/entities";
import { Repository } from "typeorm";
import { ListProposalDto } from "./dto/list-proposal.dto";
import { DEFAULT_PAGING } from "src/common/constants/paging";
import { UserService } from "../user";
import { PROPOSAL_STATUS, ROLE } from "src/common/constants";
import { CreateProposalDto } from "./dto/create-proposal.dto";
import { ClassService } from "../class";


@Injectable()
export class ProposalService {
    constructor(
        @InjectRepository(Proposals) private readonly proposalRepos: Repository<Proposals>,
        private readonly userService: UserService,
        private readonly classService: ClassService,
    ) {}

    async listProposal(dto: ListProposalDto) {
        const current = new Date();
        let month = current.getMonth() + 1;
        const year = current.getFullYear();
        const lastDay = new Date(year, month+1,0);
        let formatMonth = month <= 9 ? `0${month}` : month.toString();
        const startDate = `${year}-${formatMonth}-01`;
        const endDate = `${year}-${formatMonth}-${lastDay.getDate()}`;
        const { page = DEFAULT_PAGING.PAGE, size = DEFAULT_PAGING.LIMIT, start = startDate, end = endDate,...rest  } = dto;
        if(dto.userId) {
            await this.userService.getUser(dto.userId)
        }

        let paramArr = [` p."time" >= '${start}' `, ` p."time" <= '${end}' ` ];
        
        for(const [k,v] of Object.entries(rest)) {
            paramArr.push(' p."' + k + `" = '` + v + `'`)
        }
        
        let qr = 'select p.*, u.name as user, u.email as email from proposals p, users u where p.user_id=u.id';
        if(paramArr.length >0) {
            qr = qr + ' AND ' + paramArr.join(' AND ')
        }

        const skip = (page-1)*size;
        qr += ` limit ${size} offset ${skip}`;

        const result = await this.proposalRepos.query(qr);

        return result;   
    }

    async getProposal(id: number) {
        const proposal = await this.proposalRepos.findOne({
            where: {
                id: id
            },
            relations: ['user']
        })

        if(!proposal) {
            throw new Error('Không tìm thấy đề xuất với id:'+id);
        }

        const {user, ...rest} = proposal;

        const doc = {
            ...rest, 
            user: user.name,
            phoneNumber: user.phoneNumber,
        }

        return doc;
    }

    async createProposal(dto: CreateProposalDto) {
        await this.userService.getUser(dto.userId);
        const { classId } = dto.subData; 
        await this.classService.getClass(classId);

        const doc = {
            ...dto,
            status: PROPOSAL_STATUS.PENDING,
        }

        const result = await this.proposalRepos.save(doc);

        return this.getProposal(result.id);
    }

    async updateProposal() {}
}