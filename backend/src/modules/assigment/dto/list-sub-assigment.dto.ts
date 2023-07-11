import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsEnum, IsNumberString, IsOptional } from 'class-validator';
import { EXAM_RESULT } from 'src/common/constants';

export class ListSubAssigmentDto {
    @ApiProperty({ required: true })
    @IsOptional()
	@IsNotEmpty()
	@IsString()
	classId?: string;

    //start, end
}
