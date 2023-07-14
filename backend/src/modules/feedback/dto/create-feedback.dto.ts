import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsEnum, IsNumberString, IsOptional } from 'class-validator';
import { FEEDBACK_TYPE, PROPOSAL_STATUS, PROPOSAL_TYPE } from 'src/common/constants';
import { STUDENT_REGISTER_CLASS, STUDENT_TERMINATE_CLASS, TEACHER_REGISTER_CLASS, TEACHER_TAKE_BRAKE } from 'src/common/interfaces/proposals';

export class CreateFeedbackDto {
    @ApiProperty({ required: true })
	@IsNotEmpty()
	@IsString()
    from: string;

    @ApiProperty({ required: true })
	@IsNotEmpty()
	@IsString()
    to: string;

    @ApiProperty({ required: true })
	@IsNotEmpty()
    @IsEnum(FEEDBACK_TYPE)
	type: string;

    @ApiProperty({ required: true })
	@IsNotEmpty()
    @IsString()
	classId: string;

    @ApiProperty({ required: true })
	@IsNotEmpty()
    @IsString()
	feedback: string;
}
