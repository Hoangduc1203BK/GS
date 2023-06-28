import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class LoginDto {
	@ApiProperty({ required: true })
	@IsNotEmpty()
	@IsEmail()
	email: string;

	@ApiProperty({ required: true })
	@IsNotEmpty()
	@IsString()
	password: string;
}
