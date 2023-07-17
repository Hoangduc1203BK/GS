import { Body, Controller, Get, Param, Patch, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { CreateUserDto, ListUsertDto, UpdateUserDto } from "./dto";
import { UserService } from "./user.service";
import { checkEmailDecorator } from "src/core/decorator/util";
import { MailService } from "src/core/shared/services/mail/mail.service";
import { UploadService } from "src/core/shared/services/upload.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { Express } from 'express';
import { JwtAuthGuard } from "src/core/guards";
@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly mailService: MailService,
        private readonly uploadService: UploadService,
    ) {}

    @UseGuards(JwtAuthGuard)
    @Post('/avatar')
    @UseInterceptors(FileInterceptor('file'))
    async postPresign(@Req() req: Request, @UploadedFile() file: Express.Multer.File) {
        const user = req["user"];
        const path = `profile/${user["id"]}`
        const result = await this.uploadService.uploadFile(path, file.buffer);

        return {url: result};
    }

    @UseGuards(JwtAuthGuard)
    @Get('/avatar')
    async getPresign(@Req() req: Request){
        const user = req["user"];
        const path = `profile/${user["id"]}`
        const result = await this.uploadService.getPresignUrl(path);

        return result;
    }

    @Get('/')
    async listUser(@Query() query: ListUsertDto) {
        const result = await this.userService.listUser(query);

        return result;
    }

    @Get('/:id')
    async getUser(@Param('id') id: string) {
        const result = await this.userService.getUser(id);

        return result;
    }

    @Post('/')
    async createUser(@Body() createUserDto: CreateUserDto) {
        const result = await this.userService.createUser(createUserDto);

        return result;
    }

    @Patch('/:id')
    async updateUser(@Param('id') id: string, @Body() data: UpdateUserDto) {
        const result = await this.userService.updateUser(id, data);

        return result;
    }
}