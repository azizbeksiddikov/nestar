import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './libs/interceptor/Logging.interceptor';
import { graphqlUploadExpress } from 'graphql-upload';
import * as express from 'express';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(new ValidationPipe());
	app.useGlobalInterceptors(new LoggingInterceptor());

	app.enableCors({ origin: true, credentials: true }); // allow cors
	app.use(graphqlUploadExpress({ maxFileSize: 15000000, maxFiles: 10 })); // file upload
	app.use('/uploads', express.static('./uploads')); // static files

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
imageUpload (multer => graphql-upload)
Cors integration
Property Model Creation

Questions:
1. 

Docs:
https://www.npmjs.com/package/graphql-upload
https://github.com/jaydenseric/graphql-multipart-request-spec
https://docs.nestjs.com/security/cors
https://github.com/jaydenseric/graphql-upload

*/
/*

 imagesUploader
 operations: { "query": "mutation ImagesUploader($files: [Upload!]!, $target: String!) { imagesUploader(files: $files, target: $target) }", "variables": { "files": [null, null, null, null], "target": "property" }}
 map: { "0": ["variables.files.0"], "1": ["variables.files.1"], "2": ["variables.files.2"], "3": ["variables.files.3"], "4": ["variables.files.4"] }
 0: File
 1: File
 2: File
 3: File
 4: File

 **/
