import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Attendance, Bill, Classes, HistoryPrice, SubAttendance, SubBill, UserClass } from "src/databases/entities";
import { DataSource, In, IsNull, LessThan, MoreThan, Repository } from "typeorm";
import { UserService } from "../user";
import { ClassService } from "../class";
import { GeneratorService } from "src/core/shared/services";
import { CreateBillDto } from "./dto/create-bill.dto";
import { ListBillDto } from "./dto/list-bill.dto";
import { BILL_TYPE, CLASS_TYPE, USER_CLASS_TYPE } from "src/common/constants";
import { UpdateBillDto } from "./dto/updae-bill.dto";
import { Console } from "console";

@Injectable()
export class BillService {
    constructor(
        @InjectRepository(Bill) private readonly billRepos: Repository<Bill>,
        @InjectRepository(SubBill) private readonly subBillRepos: Repository<SubBill>,
        @InjectRepository(Classes) private readonly classRepos: Repository<Classes>,
        @InjectRepository(SubAttendance) private readonly subAttendanceRepos: Repository<SubAttendance>,
        @InjectRepository(Attendance) private readonly attendanceRepos: Repository<Attendance>,
        @InjectRepository(UserClass) private readonly userClassRepos: Repository<UserClass>,
        @InjectRepository(HistoryPrice) private readonly historyRepos: Repository<HistoryPrice>,
        private readonly dataSource: DataSource,
        private readonly userService: UserService,
        private readonly classService: ClassService,
        private readonly generatorService: GeneratorService,
    ) { }

    async getBill(userId: string, monthInput?: string, billOf?: string) {
        const current = new Date();
        let month = current.getMonth() + 1;
        const currentMonth =  monthInput == null ? (month <=9 ? `0${month}` : month.toString()) : monthInput;
        const startOfMonth = `${current.getFullYear()}-${currentMonth}-01`;
        const last = new Date(current.getFullYear(), current.getMonth()+1, 0)
        const endOfMonth = `${current.getFullYear()}-${currentMonth}-${last.getDate()}`;

        const bills = await this.billRepos.find({
            where: { 
                userId: userId,
                day: LessThan(endOfMonth),
                // billOf: billOf
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
        const subBillResult =await Promise.all(subBills.map(async(el) => {
            const histories = await this.historyRepos.find({
                where: {
                    classId: el.classId,
                    ctime: LessThan(el.mtime)
                }
            });


            const { classes, ...rest1 } = el;

            const item = {
                ...rest1,
                numberOfStudy: rest1.numberStudy,
                className: classes.name,
                subject: classes.subject.name,
                fee: rest1.status == true ? Number(histories[histories.length - 1].newPrice) : Number(classes.fee),
                teacher_rate: Number(classes.teacherRate),
                teacherFee: Number(histories[histories.length - 1].newPrice) * Number(classes.teacherRate)/100,
            }

            delete item.numberStudy

            return item;
        }));

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

    async getStatistic(monthInput?:string) {
        const current = new Date();
        let month = current.getMonth() + 1;
        const currentMonth =  monthInput != null ? monthInput : (month <=9 ? `0${month}` : month.toString());
        const startOfMonth = `${current.getFullYear()}-${currentMonth}-01`;
        const last = new Date(current.getFullYear(), monthInput != null ? Number(monthInput) : current.getMonth()+1, 0)
        const endOfMonth = `${current.getFullYear()}-${currentMonth}-${last.getDate()}`;

        const result = [] as any;
        const listClass = await this.classRepos.find({
            where: {
                type: CLASS_TYPE.ACTIVE,
            },
            order: {ctime: 'ASC'}
        });


        for(const c of listClass) {
            const listAttendance = await this.classService.listAttendance({classId: c.id, start: startOfMonth, end: endOfMonth});
            let listBillDone = await this.subBillRepos.find({
                where: {
                    classId: c.id, status: true, ctime: LessThan(last)
                }
            })

            let bills = await this.billRepos.find({
                where: {
                    billOf: 'student'
                }
            })


            listBillDone = listBillDone.filter(sub => {
                return bills.some(b => b.id === sub.billId);
              });
            
            const numberOfStudent = await this.userClassRepos.count({
                where: {
                    classId: c.id,
                    dtime: IsNull()
                }
            })

            const histories = await this.historyRepos.find({
                where: {
                    classId: c.id,
                    ctime : LessThan(last)
                }
            })

            const price = histories.length > 0 ? Number(histories[histories.length-1].newPrice) : Number(c.fee);

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
                totalFee: numberOfSubAttend * price,
                numberOfDone: `${listBillDone.length}/${numberOfStudent}`,
                totalDone: total,
                totalNotDone: numberOfSubAttend * price - total,
                teacherSalary: Number(c.teacherRate) ? listAttendance.length * price * Number(c.teacherRate)/100 : listAttendance.length * price * 0.6
            }

            result.push(item)
        }

        return result
        
    }

    async getDetailStatistic(classId: string) {
        const listUserInClass = await this.classService.listUserInClass(classId, USER_CLASS_TYPE.MAIN);
        const subBillsDone = await this.subBillRepos.find({
            where: {
                classId: classId
            }
        })

        let result = [] as any;
        for(const u of listUserInClass) {
            const feeOfStudent = await this.userService.listFee(u.id, {});
            const billOfStudent = await this.billRepos.findOne({
                where: {
                    userId: u.id
                },
                relations: ['subBills']
            })


            if(billOfStudent && billOfStudent.subBills.some(el => el.classId == classId && el.status == true)) {
                const classes = billOfStudent.subBills.find(el => el.classId == classId);
                const item = {
                    id: u.id,
                    name: u.name,
                    phoneNumber: u.phoneNumber,
                    address: u?.address,
                    numberOfStudy: classes.numberStudy,
                    total: Number(classes.total),
                    status: true
                }
                result.push(item)
            }else {
                const classes = feeOfStudent.classes.find(el => el.classId == classId)
                const item = {
                    id: u.id,
                    name: u.name, 
                    phoneNumber: u.phoneNumber,
                    address: u?.address,
                    numberOfStudy: classes.numberOfStudy,
                    total: Number(classes.fee) * Number(classes.numberOfStudy[0]),
                    status: false
                }

                result.push(item)
            }
        }

        return result;
    }
}