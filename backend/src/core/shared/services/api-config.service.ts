import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isNil } from 'lodash';
@Injectable()
export class ApiConfigService {
	constructor(private configService: ConfigService) {
		this.getMailConfig()
	}

	get Port(): number {
		return this.getNumber('PORT');
	}
	
	get nodeEnv(): string {
		return this.getString('NODE_ENV');
	}

	get isDevelopment(): boolean {
		return this.nodeEnv === 'development';
	}

	get isProduction(): boolean {
		return this.nodeEnv === 'production';
	}

	get isTest(): boolean {
		return this.nodeEnv === 'test';
	}

    get documentationEnabled(): boolean {
		return this.getBoolean('ENABLE_DOCUMENTATION');
	}

	getNumber(key: string): number {
		const value = this.get(key);

		try {
			return Number(value);
		} catch {
			throw new Error(key + ' Biến môi trường không phải số');
		}
	}

	getBoolean(key: string): boolean {
		const value = this.get(key);

		try {
			return Boolean(JSON.parse(value));
		} catch {
			throw new Error(key + ' Biến môi trường không phải boolean');
		}
	}

	getString(key: string): string {
		const value = this.get(key);

		return value.replace(/\\n/g, '\n');
	}

	get(key: string): string {
		const value = this.configService.get<string>(key);

		if (isNil(value)) {
			throw new Error(key + ' Biến môi trường chưa được set');
		}

		return value;
	}

	getDBConfig() {
		return {
			type: this.getString('DB_TYPE'),
			port: this.getNumber('DB_PORT'),
			host: this.getString('DB_HOST'),
			database: this.getString('DB_DATABASE'),
			username: this.getString('DB_USERNAME'),
			password: this.getString('DB_PASSWORD'),
		};
	}

	getS3Config() {
		return {
			accessKeyId: this.getString('AWS_S3_ACCESS_KEY_ID'),
			secretAccessKey: this.getString('AWS__S3_SECRET_ACCESS_KEY'),
			region: this.getString('AWS__S3_REGION'),
			bucket: this.getString('AWS__S3_PUBLIC_BUCKET_NAME'),
		};
	}

	getAuthConfig() {
		return {
			secretKey: this.getString('JWT_SECRET'),
			expiresTime: this.getNumber('JWT_EXPIRATION_TIME'),
			refreshTime: this.getNumber('JWT_REFRESH_EXPIRATION_DAY_TIME'),
			session: this.getString('SESSION_SECRET'),
		};
	}

	getRedisConfig() {
		return {
			host: this.getString('REDIS_HOST'),
			port: this.getNumber('REDIS_PORT'),
		};
	}

	getMailConfig() {
		return {
			host: this.getString('MAIL_HOST'),
			user: this.getString('MAIL_USER'),
			pass: this.getString('MAIL_PASSWORD'),
			from: this.getString('MAIL_FROM'),
			transport: this.getString('MAIL_TRANSPORT'),
		};
	}
}
