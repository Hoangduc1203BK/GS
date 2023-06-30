import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { CreateClassDto, ListClassDto, UpdateClassDto } from "./dto";
import { ClassService } from "./class.service";


@Controller('class')
export class ClassController{
    constructor(
        private readonly classService: ClassService,
    ) {}

    @Get('/room')
    async listRoom() {
        const result = await this.classService.listRoom();

        return result;
    }

    @Get('room/:id')
    async getRoom(@Param('id') id:number) {
        const result = await this.classService.getRoom(id);

        // return result;
    }

    @Post('/room')
    async createRoom(@Body() data: any) {
        const result = await this.classService.createRoom(data);
        
        return result;
    }

    @Get('/')
    async listClass(@Query() query: ListClassDto) {
        
    }

    @Get('/:id')
    async getClass(@Param('id') id: string) {
        
    }

    @Post('/')
    async createClass(@Body() createClassDto: CreateClassDto) {
        const result = await this.classService.createClass(createClassDto)

        return result;
    }

    @Patch('/:id')
    async updateClass(@Param('id') id: string, @Body() updateClassDto: UpdateClassDto) {

    }
}