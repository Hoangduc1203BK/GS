import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Exam, ExamResult, RegisterExam, SubExam } from "src/databases/entities";
import { DataSource, Repository } from "typeorm";
import { CreateExamDto } from "./dto/create-exam.dto";
import { UserService } from "../user";
import { ClassService } from "../class";
import { GeneratorService } from "src/core/shared/services";
import { UpdateExamDto } from "./dto/update-exam.dto";
import { CreateRegisterExamDto } from "./dto/create-register-exam.dto";
import { UpdateRegisterExamDto } from "./dto/update-register-exam.dto";
import { CreateExamResultDto } from "./dto/create-exam-result.dto";


@Injectable()
export class ExamService {
    constructor(
        @InjectRepository(Exam) private readonly examRepos: Repository<Exam>,
        @InjectRepository(SubExam) private readonly subExamRepos: Repository<SubExam>,
        @InjectRepository(RegisterExam) private readonly registerExamRepos: Repository<RegisterExam>,
        @InjectRepository(ExamResult) private readonly examResultRepos: Repository<ExamResult>,
        private readonly generatorService: GeneratorService,
        private readonly userService: UserService,
        private readonly classService: ClassService,
        private readonly datasource: DataSource,
    ) {}

    //exam
    async listExam() {
        const result = await this.examRepos.find({
            relations: ['teacher', 'room']
        });

        return result;
    }

    async getExam(id: string) {
        const result = await this.examRepos.findOne({
            where: {id},
            relations: ['teacher','room']
        })

        if(!result) {
            throw new Error('Kì thi không tồn tại')
        }
        const subjects = await this.subExamRepos.find({where: { examId: id}, relations: ['subject']})

        return {
            ...result,
            subjects: subjects
        };
    }

    async createExam(dto: CreateExamDto) {
        const {subjects, ...rest} = dto;
        const teacher = await this.userService.getUser(dto.teacherId);
        const room = await this.classService.getRoom(dto.roomId);
        const id =  this.generatorService.randomString(6);
        const doc = {
            id: id,
            name: dto.name,
            teacherId: dto.teacherId,
            time: dto.time,
            roomId: dto.roomId
        }

        const exam = await this.examRepos.save(doc);

        await this.datasource.manager.transaction(async (manager) => {
            for(const s of dto.subjects) {
                const subExam = {
                    examId: id,
                    subjectId: s,
                }
                await this.subExamRepos.save(subExam)
            }
        })

        const subExams = await this.subExamRepos.find({where: { examId: id }})

        return {
            ...doc,
            subjects: subExams
        }
    }

    async updateExam(id: string, dto: UpdateExamDto) {
        const {subjects, ...rest} = dto;
        const exam = await this.examRepos.findOne({where: { id }})
        if(!exam) {
            throw new Error ('Kì thi không tồn tại')
        }
        
        const doc = {
            ...exam,
            ...rest
        }

        const result = await this.examRepos.save(doc);
        if(subjects && subjects.length > 0) {
            await this.datasource.manager.transaction(async (manager) => {
                const subExams = await this.subExamRepos.find({where: { examId: id}})
                for(const se of subExams) {
                    await this.subExamRepos.delete({ id: se.id })
                }

                for(const s of subjects) {
                    const doc = {
                        examId: id,
                        subjectId: s,
                    }
                    await this.subExamRepos.save(doc)
                }
            })
        }

        const subExams = await this.subExamRepos.find({where: { examId: id }})

        return {
            ...doc,
            subjects: subExams
        }
    }

    //register-exam
    async listRegisterExam(examId: string) {
        const result = await this.registerExamRepos.find({
            where: { examId },
            relations: ['user']
        })

        return result;
    }

    async getRegisterExam(id: number) {
        const result = await this.registerExamRepos.findOne({
            where: {id}
        })

        if(!result) {
            throw new Error('Học sinh chưa đăng ký kì thi đầu vào')
        }

        return result;
    }

    async createRegisterExam(dto: CreateRegisterExamDto) {
        const user = await this.userService.getUser(dto.userId);
        const exam = await this.getExam(dto.examId);

        const doc = {
            ...dto,
            status: false,
        }

        const result = await this.registerExamRepos.save(doc)

        return result;
    }

    async updateRegisterExam(id:number, dto: UpdateRegisterExamDto) {
        const register = await this.getRegisterExam(id);

        const doc = {
            ...register,
            ...dto,
        }

        const result = await this.registerExamRepos.save(doc);

        return result;
    }

    // exam-result
    async getExamResult(id: number) {
        const result = await this.examResultRepos.findOne({where: {id}})
        if(!result) {
            throw new Error('Kết quả thi không tồn tại')
        }

        return result;
    }
    async createExamResult(dto: CreateExamResultDto) {
        const register = await this.getRegisterExam(dto.registerId);
        const subjects = await this.subExamRepos.find({where: {
            examId: register.examId
        }})

        const check = subjects.find(el => el.subjectId == dto.subjectId);

        if(!check) {
            throw new Error('Môn học không tồn tại trong kì thi')
        }

        const doc = {
            registerId: dto.registerId,
            subjectId: dto.subjectId,
            score: dto.score
        }

        const result = await this.examResultRepos.save(doc);

        return result;
    }
}