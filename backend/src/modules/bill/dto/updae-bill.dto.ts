import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsEnum, IsNumberString, IsOptional, IsEmail, IsArray } from 'class-validator';
import { BILL_TYPE } from 'src/common/constants';
import { SUB_BILL } from 'src/common/interfaces/sub-bill';

export class UpdateBillDto {
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
    description?: string;

    @ApiProperty({ required: true })
    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    total?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    day?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsNotEmpty()
    @IsArray()
    subBills?: SUB_BILL[];
}
