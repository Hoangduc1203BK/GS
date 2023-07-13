import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsEnum, IsNumberString, IsOptional, IsArray } from 'class-validator';
import { EXAM_RESULT, SUB_ASSIGMENT_STATUS } from 'src/common/constants';

export class ListAssigmenStudenttDto {
    @ApiProperty({ required: true })
	@IsNotEmpty()
	@IsString()
	classId: string;

    @ApiProperty({ required: true })
	@IsNotEmpty()
	@IsString()
	status: string;
}
