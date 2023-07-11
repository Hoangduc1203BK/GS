import { Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ListAssigmentDto } from "./dto";
import { JwtAuthGuard } from "src/core/guards";
import { AssigmentService } from "./assigment.service";

@Controller('assigments')
export class AssigmentController{
    constructor(private readonly assigmentService: AssigmentService) {}

    //assigment
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
    async createAssigment() {}

    @Patch('/')
    async updateAssigment() {}

    //sub-assigment
    @Get('/sub-assigment')
    async listSubAssigment() {}

    @Get('/sub-assigment/:id')
    async getSubAssigment() {}

    @Post('/sub-assigment')
    async createSubAssigment() {}

    @UseGuards(JwtAuthGuard)
    @Patch('/sub-assigment')
    async updateSubAssigment(@Req() req: Request) {
        const user = req['user'];
    }

}