import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import type { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
	constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

	private static handleResponse(response: Response, exception: HttpException | Error): void {
		let responseBody: any = { success: false, message: 'INTERNAL_SERVER_ERROR' };
		let statusCode: number = HttpStatus.BAD_REQUEST;
		if (exception instanceof HttpException) {
			(statusCode = exception.getStatus()), (responseBody = exception.getResponse());
		} else if (exception instanceof Error) {
			(statusCode = HttpStatus.BAD_REQUEST),
				(responseBody = {
					success: false,
					status: statusCode,
					message: exception.message,
				});
		}

		response.status(statusCode).json({
			...responseBody,
			data: null,
		});
	}
	catch(exception: HttpException | Error, host: ArgumentsHost): void {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse();

		AllExceptionsFilter.handleResponse(response, exception);
	}
}
