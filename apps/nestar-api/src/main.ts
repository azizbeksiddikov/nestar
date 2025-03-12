import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './libs/interceptor/Logging.interceptor';

// nestjs properties: Module, Controller, Resolver, Service, Interceptor, Pipe, Guard
// modules decorator's 4 components: imports, controllers, providers, exports (each is an array)

// GI = Global Integration, integrate global middleware logics
async function bootstrap() {
	// AppModule = main module in the entire app
	// app = instance of the Nest application | Nest + Express
	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(new ValidationPipe());
	app.useGlobalInterceptors(new LoggingInterceptor()); // see every api call

	await app.listen(process.env.PORT_API ?? 3000);

	console.log(`started at http://localhost:${process.env.PORT_API ?? 3000}`);
}
bootstrap();

// Questions for lecture:
// GraphQL is faster than Rest ?????
// Express, Nest, NextJS... When what tool to use?
// Development cycle of a project
// Why do we need batch project?
// Are imports in module/imports happening synchronously?
// Where we set up the port numbers?
// How nest reads .env?

/*
Situation:
input:
signup:
{
  "input":{
    "memberNick": "Andrew",
    "memberPhone": "0107305",
    "memberPassword": "damir2020",
    "memberType":"add"
  }
}

output:
GraphQL global Error: {
  code: 'BAD_USER_INPUT',
  message: 'Variable "$input" got invalid value "add" at "input.memberType"; Value "add" does not exist in "MemberType" enum.'
}


Where does it return? 
100% sure: not in memberResolver, not in FE
*/
// Useful CLI:
// nest g service components/auth --no-spec
