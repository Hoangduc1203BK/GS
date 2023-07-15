import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { ListFeedbackDto } from "./dto/list-feedback.dto";
import { FeedbackService } from "./feedback.service";
import { CreateFeedbackDto } from "./dto/create-feedback.dto";
import { UpdateFeedbackDto } from "./dto/update-feedback.dto";

@Controller('feedback')
export class FeedbackController{
    constructor(
        private readonly feedbackService: FeedbackService,
    ) {}

    @Get('/')
    async listFeedback(@Query() query: ListFeedbackDto) {
        const result = await this.feedbackService.listFeedback(query);

        return result;
    }

    @Get('/:id')
    async getFeedback(@Param('id') id: number) {
        const result = await this.feedbackService.getFeedback(id);

        return result;
    }

    @Post('/')
    async createFeedback(@Body() dto: CreateFeedbackDto) {
        const result = await this.feedbackService.createFeedback(dto);

        return result;
    }

    @Patch('/:id')
    async updateFeedback(@Param('id') id: number, @Body() dto: UpdateFeedbackDto) {
        const result = await this.feedbackService.updateFeedback(id, dto);

        return result;
    }
}