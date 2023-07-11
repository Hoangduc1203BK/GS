import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsEnum, IsNumberString, IsOptional, IsArray, IsDate } from 'class-validator';
import { CLASS_TYPE } from 'src/common/constants';
import { AttendanceInterface } from 'src/common/interfaces/attendance';
import { Schedule } from 'src/common/interfaces/time-table';
import { Column } from 'typeorm';

export class CreateAssigmentDto {
    @ApiProperty({ required: true })
	@IsNotEmpty()
	@IsString()
	title: string;

	@ApiProperty({ required: true })
	@IsNotEmpty()
	@IsString()
	deadline: string;

	@ApiProperty({ required: true })
	@IsNotEmpty()
	@IsString()
	classId: string;

	@ApiProperty({ required: true })
	@IsNotEmpty()
	@IsString()
	description: string;

	@ApiProperty({ required: true })
	@IsOptional()
	@IsNotEmpty()
	@IsString()
	file?: string;
}
