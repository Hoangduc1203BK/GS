import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { CreateUserDto, ListUsertDto, UpdateUserDto } from "./dto";
import { UserService } from "./user.service";
import { checkEmailDecorator } from "src/core/decorator/util";

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) {}

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