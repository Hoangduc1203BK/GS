import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { ListTestLearningDto } from "./dto/list-test-learning.dto";
import { TestLearningService } from "./test-learning.service";
import { CreateTestLearningDto } from "./dto/create-test-learning.dto";
import { UpdateTestLearningDto } from "./dto/update-test-learning.dto";

@Controller('test-learning')
export class TestLearningController {
    constructor(
        private readonly testLearningService: TestLearningService,
    ){}

    @Get('/')
    async listTestLearning(@Query() query: ListTestLearningDto) {
        const result = await this.testLearningService.listTestLearning(query);
        
        return result;
    }

    @Get('/:id')
    async getTestLearning(@Param('id') id:number) {
        const result = await this.testLearningService.getTestLearning(id);

        return result;
    }

    @Post('/')
    async createTestLearning(@Body() dto: CreateTestLearningDto) {
        const result = await this.testLearningService.createTestLearning(dto);

        return result;
    }

    @Patch('/:id')
    async updateTestLearning (@Param('id') id:number, @Body() dto: UpdateTestLearningDto) {
        const result = await this.testLearningService.updateTestLearning(id, dto);

        return result;
    }
}