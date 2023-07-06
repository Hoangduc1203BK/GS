import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsEnum, IsNumberString, IsOptional, IsEmail, IsBoolean } from 'class-validator';
import { ROLE } from 'src/common/constants';

export class UpdateUserDto {
	@ApiProperty({ required: true })
    @IsOptional()
    @IsString()
	name?: string;

	@ApiProperty({ required: true })
    @IsOptional()
    @IsEmail()
	email?: string;

    @ApiProperty({ required: true })
    @IsOptional()
    @IsString()
	password?: string;

    @ApiProperty({ required: true })
    @IsOptional()
    @IsString()
	birthDay?: string;

    @ApiProperty({ required: true })
    @IsOptional()
    @IsString()
	gender?: string;

    @ApiProperty({ required: true })
    @IsOptional()
    @IsString()
	address?: string;

    @ApiProperty({ required: true })
    @IsOptional()
    @IsString()
	phoneNumber?: string;

    @ApiProperty({ required: true })
    @IsOptional()
    @IsEnum(ROLE)
	role?: string;

// attribute of student
    @ApiProperty({ required: false })
    @IsOptional()
	@IsNotEmpty()
	@IsString()
	parentPhoneNumber?: string;

    @ApiProperty({ required: false })
    @IsOptional()
	@IsNotEmpty()
	@IsString()
	grade?: string;

// attribute of teacher
    @ApiProperty({ required: false })
    @IsOptional()
	@IsNotEmpty()
	@IsString()
	degree?: string;

    @ApiProperty({ required: false })
    @IsOptional()
	@IsNotEmpty()
	@IsString()
	major?: string;

    @ApiProperty({ required: false })
    @IsOptional()
	@IsNotEmpty()
	@IsBoolean()
	graduated?: boolean;

    @ApiProperty({ required: false })
    @IsOptional()
	@IsNotEmpty()
	@IsNumberString()
	experience?: number;

    @ApiProperty({ required: false })
    @IsOptional()
	@IsNotEmpty()
	@IsString()
	departmentId?: string;
}
