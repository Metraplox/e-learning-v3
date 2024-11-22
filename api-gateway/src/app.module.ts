import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ProxyModule } from './proxy/proxy.module';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { DateScalar } from "./common/date.scalar";
import { MicroservicesModule } from './config/microservices.config';
import { join } from 'path';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
            cache: true,
            expandVariables: true,
        }),
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
            sortSchema: true,
            playground: false,
            plugins: [ApolloServerPluginLandingPageLocalDefault()],
            context: ({ req }) => ({ req }),
            formatError: (error) => ({
                message: error.message,
                code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
                path: error.path,
            }),
        }),
        MicroservicesModule, // Asegúrate que este módulo se importe antes de ProxyModule
        ProxyModule,
        AuthModule,
    ],
    controllers: [AppController],
    providers: [AppService, DateScalar],
})
export class AppModule {}