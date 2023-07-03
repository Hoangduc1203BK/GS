import { Body, Controller, Get, Param, Post, Patch, Query } from "@nestjs/common";
import { ExamService } from "./exam.service";
import { CreateExamDto } from "./dto/create-exam.dto";
import { UpdateExamDto } from "./dto/update-exam.dto";
import { CreateRegisterExamDto } from "./dto/create-register-exam.dto";
import { UpdateRegisterExamDto } from "./dto/update-register-exam.dto";
import { CreateExamResultDto } from "./dto/create-exam-result.dto";

@Controller('exam')
export class ExamController {
    constructor( private readonly examService: ExamService) {}

    //exam result
    @Post('/result')
    async createExamResult(@Body() data: CreateExamResultDto) {
        const result = await this.examService.createExamResult(data);

        return result;
    } 

    //register exam
    @Post('/register')
    async registerExam(@Body() dto: CreateRegisterExamDto) {
        const result = await this.examService.createRegisterExam(dto);

        return result;
    }

    @Get('/register')
    async listRegisterExam(@Query('examId') examId: string) {
        const result = await this.examService.listRegisterExam(examId)

        return result;
    }

    @Get('/register/:id')
    async getRegisterExam(@Param('id') id: number) {
        const result = await this.examService.getRegisterExam(id);

        return result;
    }

    @Patch('/register/:id')
    async updateRegisterExam(@Param('id') id: number, @Body() dto: UpdateRegisterExamDto) {
        const result = await this.examService.updateRegisterExam(id, dto);

        return result
    }


    //exam
    @Get('/')
    async listExam() {
        const result = await this.examService.listExam()

        return result;
    }

    @Get('/:id')
    async getExam(@Param('id') id: string) {
        const result = await this.examService.getExam(id)

        return result;
    }

    @Post('/')
    async createExam (@Body() dto: CreateExamDto) {
        const result = await this.examService.createExam(dto);

        return result;
    }

    @Patch('/:id')
    async updateExam(@Param('id') id: string, @Body() dto: UpdateExamDto) {
        const result = await this.examService.updateExam(id, dto);

        return result;
    }
}