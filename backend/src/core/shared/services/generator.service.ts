import { Injectable } from '@nestjs/common';
import { ROLE } from 'src/common/constants';
import { v1 as uuid } from 'uuid';

@Injectable()
export class GeneratorService {
	public uuid(): string {
		return uuid();
	}

	public fileName(ext: string): string {
		return this.uuid() + '.' + ext;
	}

	public randomNumber(length: number): string {
		let result = '';
		const characters = '0123456789';

		for (let i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * characters.length));
		}

		return result;
	}

	public randomString(length: number): string {
		let result = '';
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		const charactersLength = characters.length;

		for (let i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}

		return result;
	}

	public randomUserID(role: string): string {
		let randomID = ''
		switch(role) {
			case ROLE.ADMIN:
				randomID = `AD${this.randomNumber(4)}`
				break;
			case ROLE.TEACHER:
				randomID = `TC${this.randomNumber(4)}`
				break;
			default:
				randomID = `ST${this.randomNumber(4)}`
		}
		return randomID;
	}
}
