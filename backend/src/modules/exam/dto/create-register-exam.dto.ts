import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsEnum, IsNumberString, IsOptional, IsArray, IsDate } from 'class-validator';
import { CLASS_TYPE } from 'src/common/constants';
import { AttendanceInterface } from 'src/common/interfaces/attendance';
import { Schedule } from 'src/common/interfaces/time-table';

export class CreateRegisterExamDto {
    @ApiProperty({ required: true })
	@IsNotEmpty()
	@IsString()
	userId: string;

    @ApiProperty({ required: true })
	@IsNotEmpty()
	@IsString()
	examId: string;
}
