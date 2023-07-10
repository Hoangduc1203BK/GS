import { ApiConfigService } from './api-config.service';
import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import * as AWS from 'aws-sdk';
@Injectable()
export class UploadService {
	private s3: S3;
	constructor(private configService: ApiConfigService) {
		const { accessKeyId, secretAccessKey } = this.configService.getS3Config();
		AWS.config.update({ accessKeyId: 'AKIATCQ75ANMZYZ6D7GA', secretAccessKey: '44usGqzQ6pvId4Nw5Gh327LsVIZ3HyRc815IoxX' });
		this.s3 = new S3();
	}

	async postPresignUrl(userId: string) {
		const { bucket } = this.configService.getS3Config();
		const params = {
			Bucket: bucket,
			Key: `${userId}`,
			Expires: 86400,
			ContentType: 'image/jpeg' || 'image/png',
		};

		const url = this.s3.getSignedUrl('putObject', params);
		return { url: url };
	}

	async getPresignUrl(userId: string) {
		const { bucket } = this.configService.getS3Config();
		const params = {
			Bucket: bucket,
			Key: `${userId}`,
			Expires: 86400,
		};

		const url = this.s3.getSignedUrl('getObject', params);
		return { url: url };
	}

	async uploadFile(title: string, file: Buffer) {
		const { bucket } = this.configService.getS3Config();
		const params = {
			Bucket: bucket,
			Body: file,
			Key: title,
			ContentType: 'image/jpeg',
		};
		const result = await this.s3.upload(params).promise();

		return result;
	}

	async deleteFile(key: string) {
		const { bucket } = this.configService.getS3Config();

		const params = { Bucket: bucket, Key: key };
		await this.s3.deleteObject(params).promise();
	}
}
