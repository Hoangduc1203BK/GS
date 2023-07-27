import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Bill, SubBill } from "src/databases/entities";
import { DataSource, In, Repository } from "typeorm";
import { UserService } from "../user";
import { ClassService } from "../class";
import { GeneratorService } from "src/core/shared/services";
import { CreateBillDto } from "./dto/create-bill.dto";
import { ListBillDto } from "./dto/list-bill.dto";
import { BILL_TYPE } from "src/common/constants";

@Injectable()
export class BillService{
    constructor(
        @InjectRepository(Bill) private readonly billRepos: Repository<Bill>,
        @InjectRepository(SubBill) private readonly subBillRepos: Repository<Bill>,
        private readonly dataSource: DataSource,
        private readonly userService: UserService,
        private readonly classService: ClassService,
        private readonly generatorService: GeneratorService,
    ) {}

    async getBill(id: string) {
        const bill = await this.billRepos.findOne({
            where: {id},
            relations: ['user', 'subBills', 'subBills.classes']
        })

        if(!bill) {
            throw new Error('Bill với Id:'+id+ 'không tồn tại')
        }

        const {user, subBills, ...rest} = bill;
        const subBillResult = subBills.map(el => {
            const {classes, ...rest1} = el;
            
            return {
                ...rest1,
                className: classes.name,
                fee: classes.fee,
            }
        })

        const result = {
            ...rest,
            username: user.name,
            subBills: subBillResult,
        }

        return result;
    }

    async createBill(dto: CreateBillDto) {
        await this.userService.getUser(dto.userId);

        const {subBills, ...rest} = dto;
        const total = subBills.reduce((init, curr) => {
            return init + curr.total;
        },0)

        const doc = {
            id: this.generatorService.randomNumber(6),
            ...rest,
            total: total,
        }

        const bill = await this.billRepos.save(doc);
        if(bill && bill.id) {
            await this.dataSource.manager.transaction(async (manager)=> {
                for(const sb of subBills) {
                    const item = {
                        ...sb,
                        billId: bill.id,
                    }

                    await manager.save(SubBill, item)
                }
            })
        }

        return this.getBill(bill.id);
    }

    async listBill(dto: ListBillDto) {
        let filter = {} as any;

        for(const [k,v] of Object.entries(dto)) {
            filter[k] = v;
        }
        const bill = await this.billRepos.find(
            {
                where: filter,
                relations: ['user']
            }
        )

        const result = [] as any;
        for(const b of bill) {
            const {user, ...rest} = b;

            result.push({
                ...rest,
                username: user.name,
            })
        }
        
        return result;
    }
}