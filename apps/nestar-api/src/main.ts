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
// Why in dto/member/member.input.ts we have memberPassword as optional?

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

/*
Bekzod aka savollari:

1. NestJS nima? Qanaqa ingridientlar bor? (7ta) Asosiy ingridient?
2. Modular property types? (4ta)
3. NestJS da qanaqa falsafa va patternlar ishlatiladi?
4. Qayerda "nestar-api" ishga tushirishdi berganmi?
5. src/main.ts da app nima? nega main.ts Global Integration maydoni?
6. dto validation 3ta darajasi?
7. dto 4 types?
8. app.module nima? 
9. imports, exports, controllers, providers farqi nimada?
10. member.module nima? 
11. Har bir module ichida MVC bor
12. Yangi resolver CLI orqali qanaqa create qilish kerak? 
(nest g resolver components/property --no-spec)
13. Yangi module ni organize qilish

101chi dars:
1. Validation Pipe => Global Integration
2. GQL formatted error
3. Logging ishlashi
4. Validation nimani tekshiradi? string ni number ga ozgartirolidimi?
5. 1 surprize task takrorlashda
6. 

*/

/*
[Konspekt]
103. Auth. Guard & Custom Decorators

Material:
Authorization & Authentification via Token
Guards stands between request and controller

Questions:
1. 3ta Authentification turlari?
2. Browser Storage types? Nega Cookie ishlatdik?
3. Authorization vs Authentification?

Docs:
https://docs.nestjs.com/guards



Answers:
1. sessions cookies, token cookies, tokens headers
2. safe and kamikadze
*/
