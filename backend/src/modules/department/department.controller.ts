import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ListDepartmentDto, UpdateDepartmentDto } from './dto';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { DepartmentService } from './department.service';

@Controller('department')
export class DepartmentController {
  constructor(
    private readonly departmentService: DepartmentService
  ) {}

  @Get('/')
  async listDepartment(@Query() query: ListDepartmentDto) {
    const result = await this.departmentService.listDepartment(query)

    return result;
  }

  @Get('/:id')
  async getDepartment(@Param('id') id: number) {
    const result = await this.departmentService.getDepartment(id)

    return result;
  }

  @Post('/')
  async createDepartment(@Body() createDepartmentDto: CreateDepartmentDto) {
    const result = await this.departmentService.createDepartment(createDepartmentDto)

    return result;
  }

  @Patch('/:id')
  async updateDepartment(@Param('id') id: number, @Body() updateDepartment: UpdateDepartmentDto) {
    const result = await this.departmentService.updateDepartment(id, updateDepartment)

    return result;
  }
}
