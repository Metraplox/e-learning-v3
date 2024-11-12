import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ProxyModule } from './proxy/proxy.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { DateScalar } from "./common/date.scalar";
import {ClientsModule, Transport} from "@nestjs/microservices";
import {GraphQLResolver} from "./proxy/graphql.resolver";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),

        ClientsModule.registerAsync([
            {
                name: 'USERS_SERVICE',
                imports: [ConfigModule],
                useFactory: async (configService: ConfigService) => ({
                    transport: Transport.RMQ,
                    options: {
                        urls: [configService.get<string>('RABBITMQ_URL')],
                        queue: configService.get<string>('RABBITMQ_QUEUE'),
                        queueOptions: {
                            durable: false
                        },
                    },
                }),
                inject: [ConfigService],
            },
            {
                name: 'COURSES_SERVICE',
                imports: [ConfigModule],
                useFactory: async (configService: ConfigService) => ({
                    transport: Transport.RMQ,
                    options: {
                        urls: [configService.get<string>('RABBITMQ_URL')],
                        queue: configService.get<string>('COURSES_QUEUE'), // Asegurarse de que 'COURSES_QUEUE' esté bien definido
                        queueOptions: {
                            durable: false
                        },
                    },
                }),
                inject: [ConfigService],
            },
            {
                name: 'PAYMENTS_SERVICE',
                imports: [ConfigModule],
                useFactory: async (configService: ConfigService) => ({
                    transport: Transport.RMQ,
                    options: {
                        urls: [configService.get<string>('RABBITMQ_URL')],
                        queue: configService.get<string>('PAYMENTS_QUEUE'),
                        queueOptions: {
                            durable: false
                        },
                    },
                }),
                inject: [ConfigService],
            },
        ]),

        GraphQLModule.forRoot<ApolloDriverConfig>({
            context: ({ req }) => ({ req }),
            driver: ApolloDriver,
            autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
            sortSchema: true,
            playground: false,
            plugins: [ApolloServerPluginLandingPageLocalDefault()],
            buildSchemaOptions: {
                dateScalarMode: 'timestamp',
                numberScalarMode: 'float',
            },

            formatError: (error) => ({
                message: error.message,
                code: error.extensions?.code || 'SERVER_ERROR',
                locations: error.locations,
                path: error.path,
            }),
        }),

        AuthModule,
        ProxyModule,
    ],
    controllers: [AppController],
    providers: [AppService, DateScalar, GraphQLResolver],
})
export class AppModule {}
