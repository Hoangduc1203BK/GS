import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsEnum, IsNumberString, IsOptional, IsArray, IsDate } from 'class-validator';
import { CLASS_TYPE } from 'src/common/constants';
import { AttendanceInterface } from 'src/common/interfaces/attendance';
import { Schedule } from 'src/common/interfaces/time-table';

export class CreateAttendanceDto {
    @ApiProperty({ required: true })
	@IsNotEmpty()
	@IsString()
	teacherId: string;

    @ApiProperty({ required: true })
	@IsNotEmpty()
	@IsString()
	classId: string;

	@ApiProperty({ required: true })
	@IsNotEmpty()
	@IsString()
	date: string;

	@ApiProperty({ required: true })
	@IsNotEmpty()
	@IsString()
	day: string;

	@ApiProperty({ required: true })
	@IsNotEmpty()
	@IsArray()
	attendances: AttendanceInterface[];
}
