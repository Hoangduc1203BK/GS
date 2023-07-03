import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsEnum, IsNumberString, IsOptional } from 'class-validator';
import { CLASS_TYPE } from 'src/common/constants';

export class ListClassDto {
	// @ApiProperty({ required: true })
    // @IsOptional()
	// @IsNotEmpty()
	// @IsNumberString()
	// page?: number;

	// @ApiProperty({ required: true })
    // @IsOptional()
	// @IsNotEmpty()
	// @IsNumberString()
	// size?: number;

	@ApiProperty({ required: true })
    @IsOptional()
	@IsNotEmpty()
	@IsEnum(CLASS_TYPE)
	type?: string;

	@ApiProperty({ required: true })
    @IsOptional()
	@IsNotEmpty()
	@IsString()
	subjectId?: string;

	@ApiProperty({ required: true })
    @IsOptional()
	@IsNotEmpty()
	@IsString()
	teacher?: string;

	@ApiProperty({ required: true })
    @IsOptional()
	@IsNotEmpty()
	@IsNumberString()
	roomId?: number;

	@ApiProperty({ required: true })
    @IsOptional()
	@IsNotEmpty()
	@IsString()
	date?: string;

	@ApiProperty({ required: true })
    @IsOptional()
	@IsNotEmpty()
	@IsString()
	start?: string;

	@ApiProperty({ required: true })
    @IsOptional()
	@IsNotEmpty()
	@IsString()
	end?: string;
}
