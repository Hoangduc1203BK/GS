import { Controller, Get, Patch, Post } from "@nestjs/common";

@Controller('feedback')
export class FeedbackController{
    constructor() {}

    @Get('/')
    async listFeedback() {}

    @Get('/')
    async getFeedback() {}

    @Post('/')
    async createFeedback() {

    }

    @Patch('/')
    async updateFeedback() {}
}