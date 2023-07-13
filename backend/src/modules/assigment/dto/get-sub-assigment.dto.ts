import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsEnum, IsNumberString, IsOptional } from 'class-validator';
import { EXAM_RESULT } from 'src/common/constants';

export class GetSubAssigmentDto {
    @ApiProperty({ required: true })
    @IsOptional()
	@IsNotEmpty()
	@IsNumberString()
	assigmentId?: number;

    @ApiProperty({ required: true })
    @IsOptional()
	@IsNotEmpty()
	@IsString()
	studentId?: string;

    @ApiProperty({ required: true })
    @IsOptional()
	@IsNotEmpty()
	@IsNumberString()
	id?: number;

    //start, end
}
