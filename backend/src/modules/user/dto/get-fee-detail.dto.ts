import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsNumberString, IsOptional } from 'class-validator';
import { ROLE } from 'src/common/constants';

export class GetFeeDetailDto {
    @ApiProperty({ required: true })
	@IsNotEmpty()
	@IsString()
	classId: string;

    @ApiProperty({ required: true })
	@IsNotEmpty()
	@IsString()
	start: string;

    @ApiProperty({ required: true })
	@IsNotEmpty()
	@IsString()
	end: string;
}
