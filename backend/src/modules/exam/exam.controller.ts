import { Body, Controller, Get, Param, Post, Patch, Query } from "@nestjs/common";
import { ExamService } from "./exam.service";
import { CreateExamDto } from "./dto/create-exam.dto";
import { UpdateExamDto } from "./dto/update-exam.dto";
import { ListExamDto } from "./dto";

@Controller('exam')
export class ExamController {
    constructor( private readonly examService: ExamService) {}


    //exam 
    @Get('/')
    async listExam(@Query() query: ListExamDto) {
        const result = await this.examService.listExam(query);

        return result;
    }

    @Get('/:id')
    async getExam(@Param('id') id: number) {
        const result = await this.examService.getExam(id);

        return result;
    }

    @Post('/')
    async createExam(@Body() dto: CreateExamDto) {
        const result = await this.examService.createExam(dto);

        return result;
    }

    @Patch('/:id')
    async updateExam(@Param('id') id: number, @Body() dto: UpdateExamDto) {
        const result = await this.examService.updateExam(id, dto);

        return result;
    }


}