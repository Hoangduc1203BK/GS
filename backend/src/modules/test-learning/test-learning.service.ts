import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Exam, TestLearning } from "src/databases/entities";
import { Repository } from "typeorm";
import { ClassService } from "../class/class.service";
import { ListTestLearningDto } from "./dto/list-test-learning.dto";
import { DEFAULT_PAGING } from "src/common/constants/paging";
import { paginate } from "src/common/interfaces/paginate";
import { CreateTestLearningDto } from "./dto/create-test-learning.dto";
import { UserService } from "../user";
import { UpdateTestLearningDto } from "./dto/update-test-learning.dto";
import { EXAM_RESULT, TEST_LEARNING_STATUS } from "src/common/constants";
import { ExamService } from "../exam";

@Injectable()
export class TestLearningService {
    constructor(
        @InjectRepository(TestLearning) private readonly testLearningRepos: Repository<TestLearning>,
        private readonly classService: ClassService,
        private readonly userService: UserService,
        @InjectRepository(Exam) private readonly examRepos: Repository<Exam>,
    ){}

    async listTestLearning(dto: ListTestLearningDto) {
        const { page = DEFAULT_PAGING.PAGE, size = DEFAULT_PAGING.LIMIT, userId, status } = dto;

        let filter = {} as any;
        if(userId) {
            filter.userId = userId;
        }
        if(status) {
            filter.status = status;
        }

        const testLearnings = await this.testLearningRepos.find({
            where: filter,
            relations: ['student','timeTable', 'timeTable.room', 'timeTable.classes'],
            skip: (page - 1)* size,
            take: size,
        })

        const result = testLearnings.map(testLearning => {
            const { student, timeTable, ...rest } = testLearning;
            const item = {
                ...rest,
                student: student.name,
                phoneNumber: student.phoneNumber,
                class: timeTable.classes.name,
                timeTable: {
                    date: timeTable.date,
                    start: timeTable.start,
                    end: timeTable.end
                },
                room: timeTable.room.name
            }

            return item;
        })
        
        return {result: result, ...paginate(result.length, Number(page), Number(size))};
    }

    async getTestLearning(id: number) {
        const testLearning = await this.testLearningRepos.findOne({
            where: {id},
            relations: ['student','timeTable', 'timeTable.room', 'timeTable.classes']
        })

        if(!testLearning) {
            throw new Error('Không tìm thấy lịch học thử của học sinh với mã đăng ký học thử là:'+id);
        }

        const { timeTable, student, ...rest} = testLearning;

        const result = {
            ...rest,
            student: student.name,
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
    }

    async createTestLearning(dto: CreateTestLearningDto) {
        const student = await this.examRepos.findOne({
            where: { studentId: dto.studentId}
        })


        if(!student || student.result != EXAM_RESULT.PASS) {
            throw new Error('Học sinh với id:'+dto.studentId + ' không có trong danh sách học thử');
        }
        const timeTableId = await this.classService.getTimeTable(dto.timeTableId);
        const doc = {
            ...dto,
            status: TEST_LEARNING_STATUS.PENDING,
        }
        console.log(doc)
        const result = await this.testLearningRepos.save(doc);

        return this.getTestLearning(result.id);
    }


    async updateTestLearning(id: number, dto: UpdateTestLearningDto ) {
        const testLearning = await this.testLearningRepos.findOne({
            where: {id}
        })

        if(!testLearning) {
            throw new Error('Không tìm thấy lịch học thử của học sinh với mã đăng ký học thử là:'+id);
        }

        if(dto.timeTableId) {
            await this.classService.getTimeTable(dto.timeTableId)
        }

        if(dto.status!= TEST_LEARNING_STATUS.DONE && testLearning.status == TEST_LEARNING_STATUS.DONE) {
            throw new Error('Học sinh với id:' + testLearning.studentId +  'đã học thử xong, không thể cập nhật trạng thái')
        }

        const doc = {
            ...testLearning,
            ...dto,
        }

        await this.testLearningRepos.save({id: id, ...doc});

        return this.getTestLearning(id);
    }
}