import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsEnum, IsNumberString, IsOptional, IsArray, IsDate } from 'class-validator';
import { CLASS_TYPE } from 'src/common/constants';
import { AttendanceInterface } from 'src/common/interfaces/attendance';
import { Schedule } from 'src/common/interfaces/time-table';

export class UpdateExamDto {
    @ApiProperty({ required: true })
    @IsOptional()
	@IsNotEmpty()
	@IsString()
	name?: string;

    @ApiProperty({ required: true })
    @IsOptional()
	@IsNotEmpty()
	@IsString()
	teacherId?: string;

	@ApiProperty({ required: true })
    @IsOptional()
	@IsNotEmpty()
	@IsString()
	time?: string;

	@ApiProperty({ required: true })
    @IsOptional()
	@IsNotEmpty()
	@IsNumber()
	roomId?: number;

	@ApiProperty({ required: true })
    @IsOptional()
	@IsNotEmpty()
	@IsArray()
	subjects?: string[];
}
