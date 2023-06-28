import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
@Injectable()
export class BcryptService {
	async hash(data: string) {
		const salt = 10;
		const hashData = await bcrypt.hash(data, salt);

		return hashData;
	}

	async compare(data: string, hashData: string) {
		return bcrypt.compare(data, hashData);
	}
}
