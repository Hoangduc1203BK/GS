import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsNumberString, IsOptional } from 'class-validator';
import { ROLE } from 'src/common/constants';

export class ListFeetDto {
    @ApiProperty({ required: true })
    @IsOptional()
	@IsNotEmpty()
	start?: string;

    @ApiProperty({ required: true })
    @IsOptional()
	@IsNotEmpty()
	@IsString()
	end?: string;
}
