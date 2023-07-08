import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsEnum, IsNumberString, IsOptional, IsArray } from 'class-validator';
import { TEST_LEARNING_STATUS } from 'src/common/constants';
import { TEST_LEARNING_ITEM } from 'src/common/interfaces/test-learning';

export class CreateTestLearningDto {
	@ApiProperty({ required: true })
	@IsNotEmpty()
	@IsString()
	studentId: string;

	// @ApiProperty({ required: true })
	// @IsNotEmpty()
	// @IsNumber()
	// timeTableId: number;

	@ApiProperty({ required: true })
	@IsNotEmpty()
	@IsArray()
	subjects: TEST_LEARNING_ITEM[];
}
