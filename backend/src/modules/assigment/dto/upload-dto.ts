import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsEnum, IsNumberString, IsOptional } from 'class-validator';
import { EXAM_RESULT } from 'src/common/constants';

export class UploadtDto {
    @ApiProperty({ required: true })
	@IsNotEmpty()
	@IsString()
	classId: string;

    @ApiProperty({ required: true })
	@IsNotEmpty()
	@IsNumberString()
	assigmentId: string;
}
