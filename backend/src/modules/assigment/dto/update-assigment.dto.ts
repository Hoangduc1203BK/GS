import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsEnum, IsNumberString, IsOptional, IsArray, IsDate } from 'class-validator';
import { ASSIGMENT_STATUS, CLASS_TYPE } from 'src/common/constants';
import { AttendanceInterface } from 'src/common/interfaces/attendance';
import { Schedule } from 'src/common/interfaces/time-table';
import { Column } from 'typeorm';

export class UpdateAssigmentDto {
    @ApiProperty({ required: true })
    @IsOptional()
	@IsNotEmpty()
	@IsString()
	title?: string;

	@ApiProperty({ required: true })
    @IsOptional()
	@IsNotEmpty()
	@IsString()
	deadline?: string;

	@ApiProperty({ required: true })
    @IsOptional()
	@IsNotEmpty()
	@IsString()
	classId?: string;

	@ApiProperty({ required: true })
    @IsOptional()
	@IsNotEmpty()
	@IsString()
	description?: string;

	@ApiProperty({ required: true })
	@IsOptional()
	@IsNotEmpty()
	@IsString()
	file?: string;

    @ApiProperty({ required: true })
	@IsOptional()
	@IsNotEmpty()
	@IsEnum(ASSIGMENT_STATUS)
	status?: string;
}
