import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const roles = this.reflector.get<number[]>('roles', context.getHandler());

		if (!roles) {
			return true;
		}

		const { user } = context.switchToHttp().getRequest();

		return roles.some(role => role == user.role);
	}
}
