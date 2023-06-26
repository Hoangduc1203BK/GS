import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsEnum, IsNumberString, IsOptional, IsEmail } from 'class-validator';

export class UpdateDepartmentDto {
	@ApiProperty({ required: true })
    @IsOptional()
	@IsNotEmpty()
	@IsEmail()
	email?: string;

	@ApiProperty({ required: true })
    @IsOptional()
	@IsNotEmpty()
	@IsString()
	name?: string;

    @ApiProperty({ required: true })
    @IsOptional()
	@IsNotEmpty()
	@IsString()
	description?: string;

    @ApiProperty({ required: true })
    @IsOptional()
	@IsNotEmpty()
	@IsString()
	phoneNumber?: string;

    @ApiProperty({ required: false })
    @IsOptional()
	@IsNotEmpty()
	@IsString()
	leader?: string;
}
