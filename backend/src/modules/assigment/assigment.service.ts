import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Assigment, SubAssigment, User, UserClass } from "src/databases/entities";
import { Repository } from "typeorm";
import { CreateAssigmentDto, ListAssigmentDto, UpdateAssigmentDto, UpdateSubAssigmentDto } from "./dto";
import { DEFAULT_PAGING } from "src/common/constants/paging";
import { paginate } from "src/common/interfaces/paginate";
import { ClassService } from "../class";
import { ASSIGMENT_STATUS, ROLE, SUB_ASSIGMENT_STATUS, USER_CLASS_TYPE } from "src/common/constants";
@Injectable()
export class AssigmentService{
    constructor(
        @InjectRepository(Assigment) private readonly assigmentRepos: Repository<Assigment>,
        @InjectRepository(SubAssigment) private readonly subAssigmentRepos: Repository<SubAssigment>,
        @InjectRepository(UserClass) private readonly userClassRepos: Repository<UserClass>,
        private readonly classService:  ClassService,
    ) {}

    async listAssigment(dto: ListAssigmentDto) {
        const { page=DEFAULT_PAGING.PAGE, size=DEFAULT_PAGING.LIMIT, classId } = dto;
        let result;
        let all;
        
        if(classId) {
            result = await this.assigmentRepos.find({
                where: {classId: classId},
                relations: ['classes'],
                skip: (page - 1)*size,
                take: size
            })
            all = await this.assigmentRepos.find({
                where: { classId: classId}
            })
        }else {
            result = await this.assigmentRepos.find({
                relations: ['classes'],
                skip: (page - 1)*size,
                take: size
            })

            all = await this.assigmentRepos.find()
        }

        const doc = result.map(el => {
            const { classes, ...rest} = el;
            const item = {
                ...rest,
                className: classes.name,
            }

            return item;
        })

        return { result: doc, ...paginate(doc, Number(page),Number(size), all.length)}
    }

    async getAssigment(id: number) {
        const assigment = await this.assigmentRepos.findOne({
            where: {id},
            relations: ['subAssigments', 'subAssigments.student']
        })

        const { subAssigments, ...rest } = assigment;
        const listSubAssigment = subAssigments.map(el => {
            const { student, ...rest1} = el;

            return {
                ...rest1,
                student: student.name,
            }
        })

        const result = {
            ...rest,
            subAssigments: listSubAssigment
        }

        return result;
    }

    async createAssigment(dto: CreateAssigmentDto) {
        const classes = await this.classService.getClass(dto.classId);
        const students = await this.classService.listUserInClass(dto.classId, USER_CLASS_TYPE.MAIN);
        const doc = {
            ...dto,
            status: ASSIGMENT_STATUS.ACTIVE,
        }
        const assigment = await this.assigmentRepos.save(doc);

        for(const s of students) {
            const subAssigment = {
                studentId: s.id,
                assigmentId: assigment.id,
                status: SUB_ASSIGMENT_STATUS.PENDING,
            }

            await this.subAssigmentRepos.save(subAssigment);
        }

        return this.getAssigment(assigment.id);
    }

    async updateAssigment(id: number, dto: UpdateAssigmentDto) {
        const assigment = await this.assigmentRepos.findOne({
            where: { id }
        })

        if(!assigment) {
            throw new Error('Không tìm thấy assigment với id:'+id);
        }

        const updateAssigment = {
            ...assigment,
            ...dto,
        }

        await this.assigmentRepos.save({id: assigment.id, ...updateAssigment})

        if(dto.status == ASSIGMENT_STATUS.DEACTIVE) {
            const subAssigments = await this.subAssigmentRepos.find({
                where: { assigmentId: assigment.id},
            })

            for(const s of subAssigments) {
                const item = {
                    ...s,
                    status: SUB_ASSIGMENT_STATUS.CANCELED
                }

                await this.subAssigmentRepos.save(item);
            }
        }

        return this.getAssigment(id);
    }

    //sub-assigment
    async listSubAssigment() {

    }
    async getSubAssigment(id: number) {
        const subAssigment = await this.subAssigmentRepos.findOne({
            where: { id },
            relations: ['assigment', 'student']
        })

        if(!subAssigment) {
            throw new Error("Không tìm thấy assigment có id:"+subAssigment.assigmentId);
        }

        return subAssigment;
    }

    async updateSubAssigment(user: User, id: number, dto: UpdateSubAssigmentDto) {
        const subAssigment = await this.subAssigmentRepos.findOne({
            where: { id }
        })
        const assigment = await this.assigmentRepos.findOne({
            where: { id: subAssigment.assigmentId}
        })

        if(!subAssigment) {
            throw new Error("Không tìm thấy assigment có id:"+subAssigment.assigmentId);
        }

        if(subAssigment && subAssigment.status == SUB_ASSIGMENT_STATUS.CANCELED) {
            throw new Error("Assigment này đã bị huỷ, không thể cập nhật");
        }

        if(user.role == ROLE.USER) {
            const current = new Date();
            const deadline = assigment.deadline;
            let doc = {
                ...subAssigment,
                ...dto,
            }
            if(current <= deadline) {
                doc = {
                    ...doc,
                    status: SUB_ASSIGMENT_STATUS.TURN_IN,
                }
            }else {
                doc = {
                    ...doc,
                    status: SUB_ASSIGMENT_STATUS.TURN_IN_LATE
                }
            }

            await this.subAssigmentRepos.save({id: id, ...doc});
        }else if(user.role == ROLE.TEACHER) {
            const doc = {
                ...subAssigment,
                ...dto
            }

            await this.subAssigmentRepos.save({id: id, ...doc});
        }
    }
}