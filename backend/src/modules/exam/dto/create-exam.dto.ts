import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsEnum, IsNumberString, IsOptional, IsArray, IsDate } from 'class-validator';
import { CLASS_TYPE } from 'src/common/constants';
import { AttendanceInterface } from 'src/common/interfaces/attendance';
import { Schedule } from 'src/common/interfaces/time-table';

export class CreateExamDto {
    @ApiProperty({ required: true })
	@IsNotEmpty()
	@IsString()
	name: string;

    @ApiProperty({ required: true })
	@IsNotEmpty()
	@IsString()
	teacherId: string;

	@ApiProperty({ required: true })
	@IsNotEmpty()
	@IsString()
	time: string;

	@ApiProperty({ required: true })
	@IsNotEmpty()
	@IsNumber()
	roomId: number;

	@ApiProperty({ required: true })
	@IsNotEmpty()
	@IsArray()
	subjects: string[];
}
