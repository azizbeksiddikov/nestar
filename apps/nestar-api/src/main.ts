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
105. GetAgents, GetAllMembersByAdmin, UpdateMemberByAdmin GraphQL API

Material:
GetAgents
Mongoose $facet
getAllMembersByAdmin
UpdateMemberByAdmin

Questions:
1. How to use $facet in mongoose?
2. In MongoDB sometimes we pass ObjectId, sometimes string. Why?

Docs:

*/
