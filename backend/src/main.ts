import {
	ClassSerializerInterceptor,
	HttpStatus,
	Logger,
	UnprocessableEntityException,
	ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { ExpressAdapter } from '@nestjs/platform-express';
import compression from 'compression';
import { middleware as expressCtx } from 'express-ctx';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { setupSwagger } from './setup-swagger';
import { ApiConfigService } from './core/shared/services/api-config.service';
import { SharedModule } from './core/shared/shared.module';
import { AllExceptionsFilter } from './core/exception/allexception';

export async function bootstrap(): Promise<NestExpressApplication> {
	// const app = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter(), { cors: true });
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const adapter = app.get(HttpAdapterHost);
	app.enable('trust proxy'); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
	app.use(helmet());
	app.setGlobalPrefix('api'); // use api as global prefix if you don't have subdomain
	app.use(
		rateLimit({
			windowMs: 15 * 60 * 1000, // 15 minutes
			max: 10000, // limit each IP to 10000 requests per windowMs,
			standardHeaders: true, // return rate limit info in RateLimit-Remaining
			legacyHeaders: false,
		}),
	);
	app.use((_, res, next) => {
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
		res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
		next();
	});
	app.enableCors({
		allowedHeaders: '*',
		origin: '*',
		credentials: true,
	});
	// app.use(compression());
	app.enableVersioning({
		defaultVersion: '1',
		type: VersioningType.URI,
	});

	const reflector = app.get(Reflector);

	// filter pipes
	app.useGlobalFilters(new AllExceptionsFilter(adapter));

	app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
			transform: true,
			dismissDefaultMessages: true,
			exceptionFactory: errors => new UnprocessableEntityException(errors),
		}),
	);

	const configService = app.select(SharedModule).get(ApiConfigService);

	if (configService.documentationEnabled) {
		setupSwagger(app);
	}

	app.use(expressCtx);

	// Starts listening for shutdown hooks
	if (!configService.isDevelopment) {
		app.enableShutdownHooks();
	}

	const port = configService.Port;
	await app.listen(port);

	Logger.log(`server running on ${port}`);

	return app;
}

void bootstrap();
