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
	@IsNumberString()
	numberStudent: number;

    @ApiProperty({ required: true })
	@IsNotEmpty()
	@IsNumberString()
	fee: number;

	@ApiProperty({ required: true })
	@IsNotEmpty()
	@IsString()
	subjectId: string;

	@ApiProperty({ required: true })
	@IsNotEmpty()
	@IsString()
	teacher: string;

	@ApiProperty({ required: true })
	@IsNotEmpty()
	@IsNumberString()
	roomId: number;

	@ApiProperty({ required: true })
	@IsNotEmpty()
	@IsArray()
	schedules: Schedule[];
}
