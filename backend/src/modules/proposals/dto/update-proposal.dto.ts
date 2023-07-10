import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsEnum, IsNumberString, IsOptional } from 'class-validator';
import { PROPOSAL_STATUS, PROPOSAL_TYPE } from 'src/common/constants';
import { STUDENT_REGISTER_CLASS, STUDENT_TERMINATE_CLASS, TEACHER_REGISTER_CLASS, TEACHER_TAKE_BRAKE } from 'src/common/interfaces/proposals';

export class UpdateProposalDto {
    @ApiProperty({ required: true })
	@IsNotEmpty()
	@IsEnum(PROPOSAL_STATUS)
    status: string;

    @ApiProperty({ required: true })
	@IsNotEmpty()
	subData?: TEACHER_TAKE_BRAKE;
}
