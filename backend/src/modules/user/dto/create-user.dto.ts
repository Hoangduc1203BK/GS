import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsEnum, IsNumberString, IsOptional, IsEmail, IsBoolean } from 'class-validator';
import { ROLE } from 'src/common/constants';

export class CreateUserDto {
	@ApiProperty({ required: true })
	@IsNotEmpty()
	@IsString()
	name: string;

	@ApiProperty({ required: true })
	@IsNotEmpty()
	@IsEmail()
	email: string;

    @ApiProperty({ required: true })
	@IsOptional()
	@IsNotEmpty()
	@IsString()
	birthDay?: string;

    @ApiProperty({ required: true })
	@IsOptional()
	@IsNotEmpty()
	@IsString()
	gender?: string;

    @ApiProperty({ required: true })
	@IsOptional()
	@IsNotEmpty()
	@IsString()
	address?: string;

    @ApiProperty({ required: true })
	@IsNotEmpty()
	@IsString()
	phoneNumber: string;

    @ApiProperty({ required: true })
	@IsNotEmpty()
	@IsEnum(ROLE)
	role: string;

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

	@ApiProperty({ required: false })
    @IsOptional()
	@IsNotEmpty()
	@IsString()
	studentSchool?: string;

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
	@IsNumber()
	experience?: number;

    @ApiProperty({ required: false })
    @IsOptional()
	@IsNotEmpty()
	@IsString()
	departmentId?: string;

	@ApiProperty({ required: false })
    @IsOptional()
	@IsNotEmpty()
	@IsString()
	teacherSchool?: string;
}
