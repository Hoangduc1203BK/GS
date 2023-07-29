import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Attendance, Bill, Classes, SubAttendance, SubBill, UserClass } from "src/databases/entities";
import { DataSource, In, IsNull, LessThan, MoreThan, Repository } from "typeorm";
import { UserService } from "../user";
import { ClassService } from "../class";
import { GeneratorService } from "src/core/shared/services";
import { CreateBillDto } from "./dto/create-bill.dto";
import { ListBillDto } from "./dto/list-bill.dto";
import { BILL_TYPE, CLASS_TYPE, USER_CLASS_TYPE } from "src/common/constants";
import { UpdateBillDto } from "./dto/updae-bill.dto";

@Injectable()
export class BillService {
    constructor(
        @InjectRepository(Bill) private readonly billRepos: Repository<Bill>,
        @InjectRepository(SubBill) private readonly subBillRepos: Repository<SubBill>,
        @InjectRepository(Classes) private readonly classRepos: Repository<Classes>,
        @InjectRepository(SubAttendance) private readonly subAttendanceRepos: Repository<SubAttendance>,
        @InjectRepository(Attendance) private readonly attendanceRepos: Repository<Attendance>,
        @InjectRepository(UserClass) private readonly userClassRepos: Repository<UserClass>,
        private readonly dataSource: DataSource,
        private readonly userService: UserService,
        private readonly classService: ClassService,
        private readonly generatorService: GeneratorService,
    ) { }

    async getBill(userId: string) {
        const current = new Date();
        let month = current.getMonth() + 1;
        const currentMonth =  month <=9 ? `0${month}` : month.toString();
        const startOfMonth = `${current.getFullYear()}-${currentMonth}-01`;
        const last = new Date(current.getFullYear(), current.getMonth()+1, 0)
        const endOfMonth = `${current.getFullYear()}-${currentMonth}-${last.getDate()}`;
        const bills = await this.billRepos.find({
            where: { 
                userId: userId,
                day: LessThan(endOfMonth),
             },
            relations: ['user', 'subBills', 'subBills.classes', 'subBills.classes.subject']
        })

        if(bills.length==0) {
            const result = {
                status: 400,
                data: null,
                message:'Bill của học sinh với id:' + userId + ' không tồn tại'
            }

            return result;
        }

        const bill = bills[bills.length-1];

        const { user, subBills, ...rest } = bill;
        const subBillResult = subBills.map(el => {
            const { classes, ...rest1 } = el;

            const item = {
                ...rest1,
                numberOfStudy: rest1.numberStudy,
                className: classes.name,
                subject: classes.subject.name,
                fee: classes.fee,
            }

            delete item.numberStudy

            return item;
        })

        const result = {
            ...rest,
            username: user.name,
            subBills: subBillResult,
            total: Number(rest.total)
        }

        return result;
    }

    async createBill(dto: CreateBillDto) {
        await this.userService.getUser(dto.userId);

        const { subBills, ...rest } = dto;
        let total = 0;

        for (const sb of subBills) {
            if (sb.status) {
                total += sb.total;
            }
        }

        const doc = {
            id: this.generatorService.randomNumber(6),
            ...rest,
            total: total,
        }

        const bill = await this.billRepos.save(doc);
        if (bill && bill.id) {
            await this.dataSource.manager.transaction(async (manager) => {
                for (const sb of subBills) {
                    const item = {
                        ...sb,
                        billId: bill.id,
                    }

                    await manager.save(SubBill, item)
                }
            })
        }

        return this.getBill(dto.userId);
    }

    async updateBill(id: string, dto: UpdateBillDto) {
        const bill = await this.billRepos.findOne({
            where: { id }
        })

        if (!bill) {
            // throw new Error('Không tìm thấy hóa đơn với id:' + id);
            const result = {
                status: 400,
                data: null,
                message:'Bill với id:' + id + ' không tồn tại'
            }

            return result;
        }

        const { subBills, ...rest } = dto;
        let doc = {
            ...bill,
            ...rest,
        };

        if (subBills && subBills.length > 0) {
            const subBillsResult = await this.subBillRepos.find({
                where: { billId: id },
            })

            for (const sb of subBillsResult) {
                await this.subBillRepos.delete(sb.id);
            }

            for (const sb of subBills) {
                const item = {
                    ...sb,
                    billId: id,
                }

                await this.subBillRepos.save(item);
            }

            let total = 0;

            for (const sb of subBills) {
                if (sb.status) {
                    total += sb.total;
                }
            }

            doc = {
                ...doc,
                total: total,
            }
            await this.billRepos.save({id: id, ...doc});
        } else {
            await this.billRepos.save({id: id, ...doc});
        }

        return this.getBill(bill.userId);
    }

    async listBill(dto: ListBillDto) {
        let filter = {} as any;

        for (const [k, v] of Object.entries(dto)) {
            filter[k] = v;
        }
        const bill = await this.billRepos.find(
            {
                where: filter,
                relations: ['user']
            }
        )

        const result = [] as any;
        for (const b of bill) {
            const { user, ...rest } = b;

            result.push({
                ...rest,
                username: user.name,
                total: Number(rest.total)
            })
        }

        return result;
    }

    async getStatistic() {
        const current = new Date();
        let month = current.getMonth() + 1;
        const currentMonth =  month <=9 ? `0${month}` : month.toString();
        const startOfMonth = `${current.getFullYear()}-${currentMonth}-01`;
        const last = new Date(current.getFullYear(), current.getMonth()+1, 0)
        const endOfMonth = `${current.getFullYear()}-${currentMonth}-${last.getDate()}`;
        
        const result = [] as any;
        const listClass = await this.classRepos.find({
            where: {type: CLASS_TYPE.ACTIVE}
        });


        for(const c of listClass) {
            const listAttendance = await this.classService.listAttendance({classId: c.id, start: startOfMonth, end: endOfMonth});
            const listBillDone = await this.subBillRepos.find({
                where: {classId: c.id, status: true}
            })
            const numberOfStudent = await this.userClassRepos.count({
                where: {
                    classId: c.id,
                    dtime: IsNull()
                }
            })

            let total = 0;
            let numberOfSubAttend = 0;

            if(listBillDone.length >0) {
                total = listBillDone.reduce((init,current)=> {
                    return init + Number(current.total);
                },0)
            }


            for(const attend of listAttendance) {
                let numberItem = await this.subAttendanceRepos.count({
                    where: {attendanceId: attend.id, status: true}
                })

                numberOfSubAttend+=numberItem;
            }

            const item = {
                id: c.id, 
                name: c.name,
                numberOfStudy: listAttendance.length,
                endDate: listAttendance.length >0 ? listAttendance[listAttendance.length-1].day : null,
                totalFee: numberOfSubAttend * Number(c.fee),
                numberOfDone: `${listBillDone.length}/${numberOfStudent}`,
                totalDone: total,
                totalNotDone: numberOfSubAttend * Number(c.fee) - total,
                teacherSalary: c.teacherRate ? listAttendance.length * Number(c.fee) * c.teacherRate : listAttendance.length * Number(c.fee) * 0.1
            }

            result.push(item)
        }

        return result
        
    }
}