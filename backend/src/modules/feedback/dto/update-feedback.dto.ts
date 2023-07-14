import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsEnum, IsNumberString, IsOptional } from 'class-validator';
import { FEEDBACK_TYPE, PROPOSAL_STATUS, PROPOSAL_TYPE } from 'src/common/constants';
import { STUDENT_REGISTER_CLASS, STUDENT_TERMINATE_CLASS, TEACHER_REGISTER_CLASS, TEACHER_TAKE_BRAKE } from 'src/common/interfaces/proposals';

export class UpdateFeedbackDto {
    @ApiProperty({ required: true })
    @IsOptional()
	@IsNotEmpty()
	@IsString()
    from?: string;

    @ApiProperty({ required: true })
    @IsOptional()
	@IsNotEmpty()
	@IsString()
    to?: string;

    @ApiProperty({ required: true })
    @IsOptional()
	@IsNotEmpty()
    @IsEnum(FEEDBACK_TYPE)
	type?: string;

    @ApiProperty({ required: true })
    @IsOptional()
	@IsNotEmpty()
    @IsString()
	classId?: string;

    @ApiProperty({ required: true })
    @IsOptional()
	@IsNotEmpty()
    @IsString()
	feedback?: string;
}
