import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsEnum, IsNumberString, IsOptional, IsArray } from 'class-validator';
import { CLASS_TYPE, USER_CLASS_TYPE } from 'src/common/constants';
import { Schedule } from 'src/common/interfaces/time-table';

export class CreateUserClassDto {
    @ApiProperty({ required: true })
	@IsNotEmpty()
	@IsString()
	userId: string;

    @ApiProperty({ required: true })
	@IsNotEmpty()
	@IsString()
	classId: string;

    @ApiProperty({ required: true })
    @IsOptional()
	@IsNotEmpty()
	@IsNumber()
	score?: number;

	@ApiProperty({ required: true })
	@IsNotEmpty()
	@IsEnum(USER_CLASS_TYPE)
	type: string;
}
