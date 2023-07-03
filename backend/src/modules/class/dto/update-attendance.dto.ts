import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsEnum, IsNumberString, IsOptional, IsArray } from 'class-validator';
import { CLASS_TYPE } from 'src/common/constants';
import { AttendanceInterface } from 'src/common/interfaces/attendance';
import { Schedule } from 'src/common/interfaces/time-table';

export class UpdateAttendanceDto {
    @ApiProperty({ required: true })
    @IsOptional()
	@IsNotEmpty()
	@IsString()
	teacherId?: string;

    @ApiProperty({ required: true })
    @IsOptional()
	@IsNotEmpty()
	@IsString()
	classId?: string;

	@ApiProperty({ required: true })
    @IsOptional()
	@IsNotEmpty()
	@IsString()
	date?: string;

	@ApiProperty({ required: true })
    @IsOptional()
	@IsNotEmpty()
	@IsString()
	day?: string;

	@ApiProperty({ required: true })
    @IsOptional()
	@IsNotEmpty()
	@IsArray()
	attendances?: AttendanceInterface[];
}
