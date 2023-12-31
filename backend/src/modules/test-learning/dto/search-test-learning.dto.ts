import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsNumberString, IsOptional } from 'class-validator';
import { ROLE, TEST_LEARNING_STATUS } from 'src/common/constants';

export class SearchTestLearningDto {
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
	status?: string;

    @ApiProperty({ required: true })
    @IsOptional()
	@IsNotEmpty()
	@IsString()
	classId?: string;
}
