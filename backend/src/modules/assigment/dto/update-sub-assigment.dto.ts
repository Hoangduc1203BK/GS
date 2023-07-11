import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsEnum, IsNumberString, IsOptional, IsArray, IsDate } from 'class-validator';
import { ASSIGMENT_STATUS, CLASS_TYPE, SUB_ASSIGMENT_STATUS } from 'src/common/constants';

export class UpdateSubAssigmentDto {
    @ApiProperty({ required: true })
    @IsOptional()
	@IsNotEmpty()
	@IsEnum(SUB_ASSIGMENT_STATUS)
	status?: string;

	@ApiProperty({ required: true })
    @IsOptional()
	@IsNotEmpty()
	@IsNumber()
	point?: number;

	@ApiProperty({ required: true })
    @IsOptional()
	@IsNotEmpty()
	@IsString()
	feedback?: string;

	@ApiProperty({ required: true })
    @IsOptional()
	@IsNotEmpty()
	@IsString()
	file?: string;
}
