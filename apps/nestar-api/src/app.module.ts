import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { AppResolver } from './app.resolver';
import { ComponentsModule } from './components/components.module';
import { DatabaseModule } from './database/database.module';
import { T } from './libs/types/common';

// main module in the entire app
@Module({
	imports: [
		ConfigModule.forRoot(), //
		GraphQLModule.forRoot({
			driver: ApolloDriver, // AppolloDriver =
			playground: true,
			uploads: false,
			autoSchemaFile: true,
			formatError: (error: T) => {
				const graphqlFormattedError = {
					code: error?.extensions.code,
					message: error?.extensions?.response?.message || error?.extensions?.response?.message || error?.message,
				};

				console.log('GraphQL global Error:', graphqlFormattedError);
				return graphqlFormattedError;
			},
		}),
		ComponentsModule, // HTTP, serves as a bridge
		DatabaseModule, // TCP
	],
	controllers: [AppController],
	providers: [AppService, AppResolver],
})
export class AppModule {}
