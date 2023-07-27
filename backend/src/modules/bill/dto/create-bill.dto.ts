import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsEnum, IsNumberString, IsOptional, IsEmail, IsArray } from 'class-validator';
import { BILL_TYPE } from 'src/common/constants';
import { SUB_BILL } from 'src/common/interfaces/sub-bill';

export class CreateBillDto {
	@ApiProperty({ required: true })
	@IsNotEmpty()
	@IsString()
	userId: string;

	@ApiProperty({ required: true })
	@IsNotEmpty()
	@IsEnum(BILL_TYPE)
	type: string;

    @ApiProperty({ required: true })
	@IsNotEmpty()
	@IsString()
	description: string;

    @ApiProperty({ required: true })
	@IsNotEmpty()
	@IsNumber()
	total: number;

    @ApiProperty({ required: false })
	@IsNotEmpty()
	@IsString()
	day: string;

    @ApiProperty({ required: false })
	@IsNotEmpty()
	@IsArray()
	subBills: SUB_BILL[];
}
