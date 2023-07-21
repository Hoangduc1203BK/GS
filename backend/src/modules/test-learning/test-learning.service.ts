import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Exam, Subject, TestLearning } from "src/databases/entities";
import { In, Repository } from "typeorm";
import { ClassService } from "../class/class.service";
import { ListTestLearningDto } from "./dto/list-test-learning.dto";
import { DEFAULT_PAGING } from "src/common/constants/paging";
import { paginate } from "src/common/interfaces/paginate";
import { CreateTestLearningDto } from "./dto/create-test-learning.dto";
import { UserService } from "../user";
import { UpdateTestLearningDto } from "./dto/update-test-learning.dto";
import { DEFAULT_PASSWORD, EXAM_RESULT, TEST_LEARNING_STATUS } from "src/common/constants";
import { ExamService } from "../exam";
import { SubjectService } from "../subject";
import { SearchTestLearningDto } from "./dto/search-test-learning.dto";
import { MailService } from "src/core/shared/services/mail/mail.service";

@Injectable()
export class TestLearningService {
    constructor(
        @InjectRepository(TestLearning) private readonly testLearningRepos: Repository<TestLearning>,
        private readonly classService: ClassService,
        private readonly userService: UserService,
        @InjectRepository(Exam) private readonly examRepos: Repository<Exam>,
        private readonly mailService: MailService,
    ){}

    async listTestLearning(dto: ListTestLearningDto) {
        const { page = DEFAULT_PAGING.PAGE, size = DEFAULT_PAGING.LIMIT, userId, status } = dto;

        let filter = {} as any;
        if(userId) {
            filter.studentId = userId;
        }
        if(status) {
            filter.status = In(status.split(','));
        }

        const testLearnings = await this.testLearningRepos.find({
            where: filter,
            relations: ['student','timeTable', 'timeTable.room', 'timeTable.classes', 'subject'],
            skip: (page - 1)* size,
            take: size,
        })

        const result = [];

        for(const testLearning of testLearnings) {
            const { student, timeTable, subject, ...rest } = testLearning;
            const item = {
                ...rest,
                student: student.name,
                subject: subject.name,
                grade: student.grade,
                phoneNumber: student.phoneNumber,
                class: timeTable ? timeTable.classes.name : null,
                timeTable: {
                    date: timeTable ? timeTable.date: null,
                    start: timeTable ? timeTable.start: null,
                    end: timeTable ? timeTable.end : null
                },
                room: timeTable ?timeTable.room.name: null
            }

            result.push(item);
        }

        const all = await this.testLearningRepos.find({
            where: filter,
            relations: ['student','timeTable', 'timeTable.room', 'timeTable.classes'],
        })
        
        return {result: result, ...paginate(result.length, Number(page), Number(size), all.length)};
    }

    async searchTestLearning(query: SearchTestLearningDto) {
        const { page=DEFAULT_PAGING.PAGE, size= DEFAULT_PAGING.LIMIT, classId, status} = query;
        const result = [];
        const timeTables = await this.classService.listTimeTable(classId);
        const listTestLearning = await this.listTestLearning({status: status})
        if(timeTables.length>0) {
            for(const t of timeTables) {
                let testLearning = listTestLearning.result.find(el => el.timeTableId == t.id);
                if(testLearning && testLearning.id){
                    result.push(testLearning);
                }
            }

            const skip = (page-1)*size;
            const resultSearch = result.slice(skip, skip+size+1);

            return { result: resultSearch,...paginate(resultSearch.length, Number(page), Number(size), result.length)}
        }else {
            return [];
        }
    }

    async getTestLearning(id: number) {
        const testLearning = await this.testLearningRepos.findOne({
            where: {id},
            relations: ['student','timeTable', 'timeTable.room', 'timeTable.classes', 'subject']
        })

        if(!testLearning) {
            throw new Error('Không tìm thấy lịch học thử của học sinh với mã đăng ký học thử là:'+id);
        }

        const { timeTable, student,subject, ...rest} = testLearning;

        if(timeTable) {
            const result = {
                ...rest,
                subject: subject.name,
                student: student.name,
                grade: student.grade,
                phoneNumber: student.phoneNumber,
                class: timeTable.classes.name,
                timeTable: {
                    date: timeTable.date,
                    start: timeTable.start,
                    end: timeTable.end
                },
                room: timeTable.room.name
            }
    
            return result;
        }else {
            const result = {
                ...rest,
                subject: subject.name,
                student: student.name,
                grade: student.grade,
                phoneNumber: student.phoneNumber,
                class: null,
                timeTable: {
                    date: null,
                    start: null,
                    end: null
                },
                room: null
            }

            return result;
        }
    }

    async createTestLearning(dto: CreateTestLearningDto) {
        const student = await this.examRepos.findOne({
            where: { studentId: dto.studentId}
        })


        if(!student || student.result != EXAM_RESULT.PASS) {
            throw new Error('Học sinh với id:'+dto.studentId + ' không có trong danh sách học thử');
        }

        const { subjects, ...rest} = dto;
        for(const s of subjects) {
            const doc = {
                ...rest,
                status: TEST_LEARNING_STATUS.PENDING,
                subjectId: s.subjectId,
                description: s.description ? s.description : null,
                desiredDate: s.desiredDate ? s.desiredDate : null,
            }

            await this.testLearningRepos.save(doc);
        }

        await this.examRepos.save({
            ...student,
            result: EXAM_RESULT.TEST_LEARNING,
        })

        return true;
        // const doc = {
        //     ...dto,
        //     status: TEST_LEARNING_STATUS.PENDING,
        // }
        // const result = await this.testLearningRepos.save(doc);

        // return this.getTestLearning(result.id);
    }


    async updateTestLearning(id: number, dto: UpdateTestLearningDto ) {
        const testLearning = await this.testLearningRepos.findOne({
            where: {id}
        })

        if(!testLearning) {
            throw new Error('Không tìm thấy lịch học thử của học sinh với mã đăng ký học thử là:'+id);
        }

        const user = await this.userService.getUser(testLearning.studentId);

        if(dto.timeTableId) {
            await this.classService.getTimeTable(dto.timeTableId)
        }

        // if(dto.status!= TEST_LEARNING_STATUS.DONE && testLearning.status == TEST_LEARNING_STATUS.DONE) {
        //     throw new Error('Học sinh với id:' + testLearning.studentId +  'đã học thử xong, không thể cập nhật trạng thái')
        // }

        if(testLearning.status == TEST_LEARNING_STATUS.DONE) {
            throw new Error('Học sinh với id:' + testLearning.studentId +  'đã học thử xong, không thể cập nhật trạng thái')
        }

        if(dto.status == TEST_LEARNING_STATUS.ACTIVE) {
            const testLearningResult = await this.getTestLearning(id);
            await this.mailService.sendMail(
                user.email,
                'Thông báo trúng tuyển',
                './test-learning',
                {
                    name: user.name,
                    className: testLearningResult.class,
                    date: testLearningResult.timeTable.date + 1,
                    day: testLearningResult.day,
                    email: user.email,
                    password: DEFAULT_PASSWORD
                }
            )
        }

        const doc = {
            ...testLearning,
            ...dto,
        }

        await this.testLearningRepos.save({id: id, ...doc});

        return this.getTestLearning(id);
    }
}