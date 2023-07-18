import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsNumberString, IsOptional } from 'class-validator';
import { ROLE } from 'src/common/constants';

export class ListUsertDto {
	@ApiProperty({ required: true })
    @IsOptional()
	@IsNotEmpty()
	@IsNumberString()
	page?: number;

	@ApiProperty({ required: true })
    @IsOptional()
	@IsNotEmpty()
	@IsNumberString()
	size?: number;

    @ApiProperty({ required: true })
    @IsOptional()
	@IsNotEmpty()
	@IsEnum(ROLE)
	role?: string;

    @ApiProperty({ required: true })
    @IsOptional()
	@IsNotEmpty()
	@IsString()
	grade?: string;

    @ApiProperty({ required: true })
    @IsOptional()
	@IsNotEmpty()
	@IsNumberString()
	departmentId?: number;

	@ApiProperty({ required: true })
    @IsOptional()
	@IsNotEmpty()
	@IsString()
	name?: string;
}
