import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsEnum, IsNumberString, IsOptional, IsEmail } from 'class-validator';

export class CreateDepartmentDto {
	@ApiProperty({ required: true })
	@IsNotEmpty()
	@IsEmail()
	email: string;

	@ApiProperty({ required: true })
	@IsNotEmpty()
	@IsString()
	name: string;

    @ApiProperty({ required: true })
	@IsNotEmpty()
	@IsString()
	description: string;

    @ApiProperty({ required: true })
	@IsNotEmpty()
	@IsString()
	phoneNumber: string;

    @ApiProperty({ required: false })
    @IsOptional()
	@IsNotEmpty()
	@IsString()
	leader?: string;
}
