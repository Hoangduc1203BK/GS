import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsEnum, IsNumberString, IsOptional } from 'class-validator';
import { PROPOSAL_STATUS, PROPOSAL_TYPE } from 'src/common/constants';
import { STUDENT_REGISTER_CLASS, STUDENT_TERMINATE_CLASS, TEACHER_REGISTER_CLASS, TEACHER_TAKE_BRAKE } from 'src/common/interfaces/proposals';

export class CreateProposalDto {
    @ApiProperty({ required: true })
	@IsNotEmpty()
	@IsString()
    userId: string

    @ApiProperty({ required: true })
	@IsNotEmpty()
    @IsEnum(PROPOSAL_TYPE)
	type: string;

    @ApiProperty({ required: true })
	@IsNotEmpty()
    @IsString()
	time: string;

    @ApiProperty({ required: true })
	@IsNotEmpty()
    @IsString()
	description: string;

    @ApiProperty({ required: true })
	@IsNotEmpty()
	subData?: TEACHER_REGISTER_CLASS | STUDENT_REGISTER_CLASS | TEACHER_TAKE_BRAKE | STUDENT_TERMINATE_CLASS;
}
