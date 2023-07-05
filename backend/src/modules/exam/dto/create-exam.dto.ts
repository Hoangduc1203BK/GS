import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsEnum, IsNumberString, IsOptional, IsArray, IsDate } from 'class-validator';
import { CLASS_TYPE } from 'src/common/constants';
import { AttendanceInterface } from 'src/common/interfaces/attendance';
import { Schedule } from 'src/common/interfaces/time-table';
import { Column } from 'typeorm';

export class CreateExamDto {
    @ApiProperty({ required: true })
	@IsNotEmpty()
	@IsString()
	studentId: string;

	@ApiProperty({ required: true })
	@IsOptional()
	@IsNotEmpty()
	@IsString()
	teacherId?: string;

	@ApiProperty({ required: true })
	@IsOptional()
	@IsNotEmpty()
	@IsNumberString()
	roomId?: number;

	@ApiProperty({ required: true })
	@IsOptional()
	@IsNotEmpty()
	@IsString()
	hour?: string;

	@ApiProperty({ required: true })
	@IsOptional()
	@IsNotEmpty()
	@IsString()
	date?: string;

	@ApiProperty({ required: true })
	@IsOptional()
	@IsNotEmpty()
	@IsString()
	description?: string;

	@ApiProperty({ required: true })
	@IsNotEmpty()
	@IsArray()
	subjects: any;
}
