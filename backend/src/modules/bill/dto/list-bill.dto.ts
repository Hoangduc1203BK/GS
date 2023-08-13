import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsEnum, IsNumberString, IsOptional, IsEmail, IsArray } from 'class-validator';
import { BILL_TYPE } from 'src/common/constants';
import { SUB_BILL } from 'src/common/interfaces/sub-bill';

export class ListBillDto {
	@ApiProperty({ required: true })
    @IsOptional()
	@IsNotEmpty()
	@IsString()
	userId?: string;

	@ApiProperty({ required: true })
    @IsOptional()
	@IsNotEmpty()
	@IsEnum(BILL_TYPE)
	type?: string;

	@ApiProperty({ required: true })
    @IsOptional()
	@IsNotEmpty()
	@IsString()
	month?: string;
}
