import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsEnum, IsNumberString, IsOptional } from 'class-validator';
import { FEEDBACK_TYPE, PROPOSAL_STATUS, PROPOSAL_TYPE } from 'src/common/constants';

export class ListFeedbackDto {
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
	from?: string;

    @ApiProperty({ required: true })
    @IsOptional()
	@IsNotEmpty()
    @IsEnum(FEEDBACK_TYPE)
	type?: string;

    @ApiProperty({ required: true })
    @IsOptional()
	@IsNotEmpty()
    @IsString()
	to?: string;

    @ApiProperty({ required: true })
    @IsOptional()
	@IsNotEmpty()
    @IsString()
	classId?: string;
}
