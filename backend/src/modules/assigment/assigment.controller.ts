import { Body, Controller, Get, Param, Patch, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { CreateAssigmentDto, ListAssigmentDto, UpdateAssigmentDto, UpdateSubAssigmentDto, UploadtDto } from "./dto";
import { JwtAuthGuard } from "src/core/guards";
import { AssigmentService } from "./assigment.service";
import { query } from "express";
import { ListAssigmenStudenttDto } from "./dto/list-assigment-for-student";
import { GetSubAssigmentDto } from "./dto/get-sub-assigment.dto";
import { Request } from 'express';
import { FileInterceptor } from "@nestjs/platform-express";
import { UploadService } from "src/core/shared/services/upload.service";
@Controller('assigments')
export class AssigmentController{
    constructor(
        private readonly assigmentService: AssigmentService,
        private readonly uploadService: UploadService,
        ) {}

    //sub-assigment
    @UseGuards(JwtAuthGuard)
    @Post('/upload')
    @UseInterceptors(FileInterceptor('file'))
    async postPresign(@Req() req: Request,@Query() query: UploadtDto, @UploadedFile() file: Express.Multer.File) {
        const { classId, assigmentId } = query;
        const user = req["user"];
        const path = `${classId}/${assigmentId}/${user["id"]}`
        const result = await this.uploadService.uploadFile(path, file.buffer);

        return result;
    }


    @UseGuards(JwtAuthGuard)
    @Get('/sub-assigment')
    async getSubAssigment(@Req() req: Request,@Query() query: GetSubAssigmentDto) {
        const user = req["user"]
        const result = await this.assigmentService.getSubAssigment({
            ...query,
            studentId: user["id"]
        });

        return result;
    }

    @Post('/sub-assigment')
    async createSubAssigment() {}

    @UseGuards(JwtAuthGuard)
    @Patch('/sub-assigment/:id')
    async updateSubAssigment(@Req() req: Request,@Param('id') id: number, @Body() dto: UpdateSubAssigmentDto) {
        const user = req['user'];
        const role = user['role']
        const result = await this.assigmentService.updateSubAssigment(role, id, dto);

        return result;
    }

    //assigment
    @UseGuards(JwtAuthGuard)
    @Get('/student')
    async getAssigmentForStudent(@Req() req: Request, @Query() query: ListAssigmenStudenttDto) {
        const user = req["user"]
        const result = await this.assigmentService.listAssigmentForStudent(user["id"], query);

        return result;
    }

    @Get('/')
    async listAssigment(@Query() query: ListAssigmentDto) {
        const result = await this.assigmentService.listAssigment(query);

        return result;
    }

    @Get('/:id')
    async getAssigment(@Param('id') id: number) {
        const result = await this.assigmentService.getAssigment(id);

        return result;
    }

    @Post('/')
    async createAssigment(@Body() dto: CreateAssigmentDto) {
        const result = await this.assigmentService.createAssigment(dto);

        return result;
    }

    @Patch('/:id')
    async updateAssigment(@Param('id') id: number, @Body() dto: UpdateAssigmentDto) {
        const result = await this.assigmentService.updateAssigment(id,dto);

        return result;
    }

}