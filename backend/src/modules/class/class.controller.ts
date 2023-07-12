import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  CreateAttendanceDto,
  CreateClassDto,
  CreateUserClassDto,
  ListClassDto,
  ListTeacherEmptyDto,
  UpdateAttendanceDto,
  UpdateClassDto,
  UpdateUserClassDto,
} from './dto';
import { ClassService } from './class.service';
import { ListAttendanceDto } from './dto/list-attendance.dto';
import { AttendanceGuard, JwtAuthGuard } from 'src/core/guards';
import { GeneratorService } from 'src/core/shared/services';
import { Request, Response } from 'express';
import { ROLE } from 'src/common/constants';

@Controller('class')
export class ClassController {
  constructor(private readonly classService: ClassService) { }

  //attendance
  @Get('/attendances')
  async listAttendance(@Query() data: ListAttendanceDto) {
    const result = await this.classService.listAttendance(data)

    return result;
  }

  @Get('/attendance')
  async getAttendance(@Query() query: any) {
    const result = await this.classService.getAttendance(query)

    return result;
  }

  @Post('/attendance')
  @UseGuards(AttendanceGuard)
  async createAttendance(@Body() createAttendanceDto: CreateAttendanceDto) {
    const result = await this.classService.createAttendance(
      createAttendanceDto,
    );

    return result;
  }

  @Patch('/attendance')
  @UseGuards(AttendanceGuard)
  async updateAttendance(
    @Query() query: any,
    @Body() updateAttendanceDto: UpdateAttendanceDto,
  ) {
    const result = await this.classService.updateAttendance(
      query,
      updateAttendanceDto,
    );

    return result;
  }

  @Get('/room')
  async listRoom() {
    const result = await this.classService.listRoom();

    return result;
  }

  @Get('room/:id')
  async getRoom(@Param('id') id: number) {
    const result = await this.classService.getRoom(id);

    return result;
  }

  @Post('/room')
  async createRoom(@Body() data: any) {
    const result = await this.classService.createRoom(data);

    return result;
  }

  @Patch('/room/:id')
  async updateRoom(@Param('id') id: number, @Body() data: any) {
    const result = await this.classService.updateRoom(id, data);

    return result;
  }

  @Post('/teacher-empty')
  async listTeacherEmpty(@Body() data: ListTeacherEmptyDto) {
    const result = await this.classService.listTeacherEmpty(data);

    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/student-empty')
  async listClassEmptyOfStudent(@Req() req: Request, @Query('subjectId') subjectId: string) {
    const user = req["user"]
    const result = await this.classService.listEmptyClassOfStudent(user["id"], subjectId);
    
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/empty')
  async listClassEmptyOfTeacher(@Req() req: Request) {
    const user = req["user"];
    const result = await this.classService.listClassEmptyOfTeacher(user["id"]);

    return result;
  }

  // user-class
  @Get('/:id/users')
  async listUserInClass(@Param('id') id: string, @Query('type') type: string) {
    const result = await this.classService.listUserInClass(id, type);

    return result;
  }

  @Get('/user/:id')
  async listClassOfUser(@Param('id') id: string, @Query('type') type: string) {
    const result = await this.classService.listClassOfUser(id, type);

    return result;
  }

  @Get('/user-class/:id')
  async getUserClass(@Param('id') id: number) {
    const result = await this.classService.getUserClass(id);

    return result;
  }

  @Post('/user-class')
  async createUserClass(@Body() data: CreateUserClassDto) {
    const result = await this.classService.createUserClass(data);

    return result;
  }

  @Patch('/user-class/:id')
  async updateUserClass(
    @Param('id') id: number,
    @Body() updateUserClassDto: UpdateUserClassDto,
  ) {
    const result = await this.classService.updateUserClass(
      id,
      updateUserClassDto,
    );

    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/schedules')
  async listScheduleOfStudent(@Req() req: Request) {
    const user = req["user"];
    const role = user["role"];
    let result;

    if (role == ROLE.USER) {
    const  result = await this.classService.listScheduleOfStudent(user["id"]);
    } else if (role == ROLE.TEACHER) {
      result = await this.classService.listSchedulesOfTeacher(user["id"]);
    }

    return result;
  }


  @Get('/')
  async listClass(@Query() query: ListClassDto) {
    const result = await this.classService.listClass(query);

    return result;
  }

  @Get('/:id')
  async getClass(@Param('id') id: string) {
    const result = await this.classService.getClass(id);

    return result;
  }

  @Post('/')
  async createClass(@Body() createClassDto: CreateClassDto) {
    const result = await this.classService.createClass(createClassDto);

    return result;
  }

  @Patch('/:id')
  async updateClass(
    @Param('id') id: string,
    @Body() updateClassDto: UpdateClassDto,
  ) {
    const result = await this.classService.updateClass(id, updateClassDto);

    return result;
  }

}
