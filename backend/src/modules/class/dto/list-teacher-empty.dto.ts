import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsEnum, IsNumberString, IsOptional, IsArray } from 'class-validator';
import { CLASS_TYPE, USER_CLASS_TYPE } from 'src/common/constants';
import { Schedule } from 'src/common/interfaces/time-table';

export class ListTeacherEmptyDto {
	@ApiProperty({ required: true })
    @IsOptional()
	@IsNotEmpty()
	@IsString()
	departmentId?: string;

	@ApiProperty({ required: true })
    @IsOptional()
	@IsNotEmpty()
	@IsArray()
	schedules?: Schedule[];
}
