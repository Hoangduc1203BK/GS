import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Exam, SubExam } from "src/databases/entities";
import { DataSource, Repository } from "typeorm";
import { CreateExamDto, UpdateExamDto,ListExamDto } from "./dto";
import { UserService } from "../user";
import { ClassService } from "../class";
import { GeneratorService } from "src/core/shared/services";
import { DEFAULT_PAGING } from "src/common/constants/paging";
import { paginate } from "src/common/interfaces/paginate";
import { EXAM_RESULT, QUEUE_JOB, STANDARD_SCORE } from "src/common/constants";
import { SubjectService } from "../subject";
import { Queue } from "bull";
import { InjectQueue } from "@nestjs/bull";


@Injectable()
export class ExamService {
    constructor(
        @InjectRepository(Exam) private readonly examRepos: Repository<Exam>,
        @InjectRepository(SubExam) private readonly subExamRepos: Repository<SubExam>,
        private readonly generatorService: GeneratorService,
        private readonly userService: UserService,
        private readonly classService: ClassService,
        private readonly subjectService: SubjectService,
        private readonly datasource: DataSource,
        @InjectQueue(QUEUE_JOB.EXAM) private readonly queue: Queue,

    ) { }

    async listExam(query: ListExamDto) {
        const { page = DEFAULT_PAGING.PAGE, size = DEFAULT_PAGING.LIMIT, ...rest } = query;
        const exams = await this.examRepos.find({
            where: rest,
            relations: ['student', 'subExams','subExams.subject', 'teacher', 'room'],
            skip: (page - 1)* size,
            take: size,
        })

        const result = exams.map((e) => {
            const {student, subExams,teacher,room, ...rest1} = e;
            const subExams1 = subExams.map(el => {
                return {
                    id: el.id,
                    examId: el.examId,
                    subjectId: el.subjectId,
                    score: el.score,
                    name: el.subject.name,
                }
            })

            const doc = {
                ...rest1,
                studentName: student.name,
                phoneNumber: student.phoneNumber,
                grade: student.grade,
                subjects: subExams1,
                teacherName: null,
                room: null
            } as any;
            if(teacher && teacher.id) {
                doc.teacherName = teacher.name;
            }

            if(room && room.id) {
                doc.room = room.name
            }
            return doc;
        })

        const all = await this.examRepos.find({
            where: rest,
            relations: ['student', 'subExams','subExams.subject', 'teacher', 'room'],
        })

        return {result: result, ...paginate(result.length, Number(page), Number(size), all.length)}
    }

    async getExam(id: number) {
        const exam = await this.examRepos.findOne({
            where: { id: id },
            relations: ['subExams', 'subExams.subject']
        })

        if(!exam) {
            throw new Error('Không tìm thấy thông tin đăng ký thi thử với id:'+id);
        }


        const { subExams, ...rest } = exam;
        
        return {
            ...rest,
            subjects: subExams
        }
    }

    async createExam(dto: CreateExamDto) {
        const { subjects, ...rest} = dto
        const student = await this.userService.getUser(dto.studentId);
        if(dto.teacherId) {
            await this.userService.getUser(dto.teacherId)
        }
        if(dto.roomId) {
            await this.classService.getRoom(dto.roomId)
        }

        const exam = await this.examRepos.save({
            ...rest,
            result: EXAM_RESULT.PENDING,
        });

        if(exam) {
            await this.datasource.manager.transaction(async (manager) => {
                for(let s of subjects) {
                    try {
                        await this.subjectService.getSubject(s.id);
                    } catch (error) {
                        await this.examRepos.delete(exam.id)
                    }
                    const item = {
                        subjectId: s.id,
                        examId: exam.id,
                    }
                    await manager.save(SubExam, item)
                }
            })
        }

        const subExams = await this.subExamRepos.find({ where: { examId: exam.id}});
        
        return {
            ...exam,
            subjects: subExams,
        }
    }


    async updateExam(id: number, dto: UpdateExamDto) {
        const { subjects, ...rest } = dto;
        const exam = await this.examRepos.findOne({
            where: { id },
        })

        if(!exam) {
            throw new Error('Không tìm thấy thông tin đăng ký thi thử với id:'+id);
        }

        if(dto.roomId) {
            await this.classService.getRoom(dto.roomId);
        }

        if(dto.teacherId) {
            await this.userService.getUser(dto.teacherId);
        }

        let doc = {
            ...exam,
            ...rest
        }

        if(subjects && subjects.length>0) {
            await this.datasource.manager.transaction(async (manager) => {
                const subExams = await this.subExamRepos.find({
                    where: { examId: exam.id}
                })

                for(let s of subExams) {
                    await this.subExamRepos.delete(s.id)
                }

                for(let s of subjects) {
                    await this.subjectService.getSubject(s.id);
                    let item = {
                        examId: exam.id,
                    } as any;

                    if(s.id) {
                        item.subjectId = s.id;
                    }

                    if(s.score) {
                        item.score = s.score;
                    }

                    await this.subExamRepos.save(item);
                }
            })
        }

        const subExams = await this.subExamRepos.find({where: {examId: exam.id}});
        const checkNull = subExams.some(el => el.score == null);
        if(checkNull) {
            doc = {
                ...doc,
                result: EXAM_RESULT.PENDING
            }
        }else {
            const sumScore = subExams.reduce((init, curr) => {
                return init+Number(curr.score);
            },0) 
            const avgScore = sumScore/subExams.length;
            if(avgScore >= STANDARD_SCORE) {
                doc = {
                    ...doc,
                    result: EXAM_RESULT.PASS
                }
            } else {
                doc = {
                    ...doc,
                    result: EXAM_RESULT.FAIL
                }
            }
        }

        await this.examRepos.save({id: id, ...doc});

        if(dto.date || dto.hour || dto.teacherId || dto.roomId) {
            const student = await this.userService.getUser(exam.studentId);
            const subExams = await this.subExamRepos.find({
                where: { examId: id},
                relations: ['subject']
            })

            if(subExams.length>0) {
                const subjects = subExams.map(el => el.subject.name);
                let hour = dto.hour ? dto.hour : exam.hour;
                let roomId = dto.roomId ? dto.roomId : exam.roomId;
                let date = dto.date ? dto.date : exam.date;

                await this.queue.add({mail: student.email,name: student.name, date, hour, roomId, subjects})
            }
        }

        return this.getExam(id);
    }
}
