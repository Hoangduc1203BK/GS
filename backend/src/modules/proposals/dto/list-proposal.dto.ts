import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsEnum, IsNumberString, IsOptional } from 'class-validator';
import { PROPOSAL_STATUS, PROPOSAL_TYPE, ROLE } from 'src/common/constants';

export class ListProposalDto {
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
	userId?: string;

    @ApiProperty({ required: true })
    @IsOptional()
	@IsNotEmpty()
    @IsEnum(PROPOSAL_TYPE)
	type?: string;

    @ApiProperty({ required: true })
    @IsOptional()
	@IsNotEmpty()
    @IsString()
	start?: string;

    @ApiProperty({ required: true })
    @IsOptional()
	@IsNotEmpty()
    @IsString()
	end?: string;

    @ApiProperty({ required: true })
    @IsOptional()
	@IsNotEmpty()
    @IsEnum(PROPOSAL_STATUS)
	status?: string;

	@ApiProperty({ required: true })
	@IsNotEmpty()
    @IsEnum(ROLE)
	role: string;
}
