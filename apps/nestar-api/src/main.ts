import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './libs/interceptor/Logging.interceptor';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(new ValidationPipe());
	app.useGlobalInterceptors(new LoggingInterceptor()); // see every api call

	await app.listen(process.env.PORT_API ?? 3000);

	console.log(`started at http://localhost:${process.env.PORT_API ?? 3000}\n`);
}
bootstrap();

// Questions for lecture:

// GraphQL is faster than Rest ?????
// Express, Nest, NextJS... When what tool to use?
// Are imports in module/imports happening synchronously?

// Why do we need batch project?
// Where we set up the port numbers?
// How nest reads .env?
// Why in dto/member/member.input.ts we have memberPassword as optional?
// Validation nimani tekshiradi? string ni number ga ozgartirolidimi?

/*
[Konspekt]
106. Serverga GraphQL orqali file yukalash jarayonini hosil qilamiz
107. Property - createProperty GraphQL API develop qilamiz

Material:


Questions:
1. 

Docs:
https://www.npmjs.com/package/graphql-upload
https://github.com/jaydenseric/graphql-multipart-request-spec

*/
