import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    Query,
  } from '@nestjs/common';
import { CreateSubjectDto, ListSubjectDto, UpdateSubjectDto } from './dto';
import { SubjectService } from './subject.service';
  
  @Controller('department')
  export class SubjectController {
    constructor(private readonly subjectService: SubjectService) {}
  
    @Get('/')
    async listSubject(@Query() query: ListSubjectDto) {
      const result = await this.subjectService.listSubject(query);

      return result;
    }
  
    @Get('/:id')
    async getSubject(@Param('id') id: string) {
      const result = await this.subjectService.getSubject(id);

      return result;
    }
  
    @Post('/')
    async createSubject(@Body() createSubjectDto: CreateSubjectDto ) {
      const result = await this.subjectService.createSubject(createSubjectDto);

      return result;
    }
  
    @Patch('/:id')
    async updateSubject(@Param('id') id: string, @Body() updateSubjectDto: UpdateSubjectDto) {
      const result = await this.subjectService.updateSubject(id,updateSubjectDto);

      return result;
    }
  }
  