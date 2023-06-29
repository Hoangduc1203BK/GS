import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { CreateClassDto, ListClassDto, UpdateClassDto } from "./dto";


@Controller('class')
export class ClassController{
    constructor() {}

    @Get('/')
    async listClass(@Query() query: ListClassDto) {
        
    }

    @Get('/:id')
    async getClass(@Param('id') id: string) {
        
    }

    @Post('/')
    async createClass(@Body() createClassDto: CreateClassDto) {

    }

    @Patch('/:id')
    async updateClass(@Param('id') id: string, @Body() updateClassDto: UpdateClassDto) {

    }
}