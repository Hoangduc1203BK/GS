import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsEnum, IsNumberString, IsOptional } from 'class-validator';
import { TEST_LEARNING_STATUS } from 'src/common/constants';

export class CreateTestLearningDto {
	@ApiProperty({ required: true })
	@IsNotEmpty()
	@IsString()
	studentId: string;

	@ApiProperty({ required: true })
	@IsNotEmpty()
	@IsNumber()
	timeTableId: number;

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
