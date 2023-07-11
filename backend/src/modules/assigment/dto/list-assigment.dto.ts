import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsEnum, IsNumberString, IsOptional } from 'class-validator';
import { EXAM_RESULT } from 'src/common/constants';

export class ListAssigmentDto {
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
	@IsString()
	classId?: string;

    //start, end
}
