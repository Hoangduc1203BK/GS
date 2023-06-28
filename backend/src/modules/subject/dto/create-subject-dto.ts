import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsEnum, IsNumberString, IsOptional } from 'class-validator';

export class CreateSubjectDto {
	@ApiProperty({ required: true })
	@IsNotEmpty()
	@IsString()
	name: string;

	@ApiProperty({ required: true })
	@IsNotEmpty()
	@IsString()
	grade: string;

    @ApiProperty({ required: true })
	@IsNotEmpty()
	@IsString()
	description: string;

    @ApiProperty({ required: true })
	@IsNotEmpty()
	@IsString()
	departmentId: string;
}
