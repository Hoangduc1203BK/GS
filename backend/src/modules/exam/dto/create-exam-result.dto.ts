import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsEnum, IsNumberString, IsOptional, IsArray, IsDate } from 'class-validator';
import { CLASS_TYPE } from 'src/common/constants';
import { AttendanceInterface } from 'src/common/interfaces/attendance';
import { Schedule } from 'src/common/interfaces/time-table';

export class CreateExamResultDto {
    @ApiProperty({ required: true })
	@IsNotEmpty()
	@IsNumber()
	registerId: number;

    @ApiProperty({ required: true })
	@IsNotEmpty()
	@IsString()
	subjectId: string;

	@ApiProperty({ required: true })
	@IsNotEmpty()
	@IsNumber()
	score: number;
}
