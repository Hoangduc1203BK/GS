import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    Query,
  } from '@nestjs/common';
import { ListSubjectDto } from './dto';
  
  @Controller('department')
  export class DepartmentController {
    constructor() {}
  
    @Get('/')
    async listSubject(@Query() query: ListSubjectDto) {}
  
    @Get('/:id')
    async getSubject(@Param('id') id: string) {}
  
    @Post('/')
    async createSubject(@Body() createSubjectDto ) {}
  
    @Patch('/:id')
    async updateSubject(@Param('id') id: number, @Body() updateSubjectDto) {}
  }
  