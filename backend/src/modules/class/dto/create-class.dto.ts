import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsEnum, IsNumberString, IsOptional, IsArray } from 'class-validator';
import { CLASS_TYPE } from 'src/common/constants';
import { Schedule } from 'src/common/interfaces/time-table';

export class CreateClassDto {
    @ApiProperty({ required: true })
	@IsNotEmpty()
	@IsString()
	name: string;

    @ApiProperty({ required: true })
	@IsNotEmpty()
	@IsNumber()
	numberStudent: number;

    @ApiProperty({ required: true })
	@IsNotEmpty()
	@IsNumber()
	fee: number;

	@ApiProperty({ required: true })
	@IsNotEmpty()
	@IsString()
	subjectId: string;

	@ApiProperty({ required: true })
    @IsOptional()
	@IsNotEmpty()
	@IsString()
	teacher?: string;

	@ApiProperty({ required: true })
	@IsNotEmpty()
	@IsArray()
	schedules: Schedule[];

	@ApiProperty({ required: true })
    @IsOptional()
	@IsNotEmpty()
	@IsNumber()
	teacherRate?: number;

	@ApiProperty({ required: true })
    @IsOptional()
	@IsNotEmpty()
	@IsString()
	startDate?: string;
}
