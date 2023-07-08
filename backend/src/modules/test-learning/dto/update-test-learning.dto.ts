import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsEnum, IsNumberString, IsOptional } from 'class-validator';
import { TEST_LEARNING_STATUS } from 'src/common/constants';

export class UpdateTestLearningDto {
	@ApiProperty({ required: true })
    @IsOptional()
	@IsNotEmpty()
	@IsString()
	userId?: string;

	@ApiProperty({ required: true })
    @IsOptional()
	@IsNotEmpty()
	@IsNumber()
	timeTableId?: number;

    @ApiProperty({ required: true })
    @IsOptional()
	@IsNotEmpty()
	@IsEnum(TEST_LEARNING_STATUS)
	status?: string;

    @ApiProperty({ required: true })
    @IsOptional()
	@IsNotEmpty()
	@IsString()
	day?: string;

    @ApiProperty({ required: true })
    @IsOptional()
	@IsNotEmpty()
	@IsString()
	description?: string;
}
