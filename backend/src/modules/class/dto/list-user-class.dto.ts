import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsEnum, IsNumberString, IsOptional } from 'class-validator';
import { CLASS_TYPE, USER_CLASS_TYPE } from 'src/common/constants';

export class ListUserClassDto {
	@ApiProperty({ required: true })
    @IsOptional()
	@IsNotEmpty()
	@IsEnum(USER_CLASS_TYPE)
	type?: string;

	@ApiProperty({ required: true })
    @IsOptional()
	@IsNotEmpty()
	@IsString()
	userId?: string;

	@ApiProperty({ required: true })
    @IsOptional()
	@IsNotEmpty()
	@IsString()
	classId?: string;
}
