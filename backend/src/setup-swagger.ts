import { INestApplication, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
	const documentBuilder = new DocumentBuilder().setTitle('API').addBearerAuth();

	if (process.env.API_VERSION) {
		documentBuilder.setVersion(process.env.API_VERSION);
	}

	const document = SwaggerModule.createDocument(app, documentBuilder.build());
	SwaggerModule.setup('documentation', app, document, {
		swaggerOptions: {
			persistAuthorization: true,
		},
	});

	Logger.log(`http://localhost:${process.env.PORT}/documentation`, 'Swagger');
}
