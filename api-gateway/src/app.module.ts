import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {AuthModule} from './auth/auth.module';
import {ProxyModule} from './proxy/proxy.module';
import {ConfigModule} from '@nestjs/config';
import {join} from 'path';
import {GraphQLModule} from '@nestjs/graphql';
import {ApolloDriver, ApolloDriverConfig} from "@nestjs/apollo";
import {ApolloServerPluginLandingPageLocalDefault} from '@apollo/server/plugin/landingPage/default';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {DateScalar} from "./common/date.scalar";

@Module({
  imports: [

      ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
      }),

      ClientsModule.register([
          {
              name: 'USERS_SERVICE',
              transport: Transport.RMQ,
              options: {
                  urls: [process.env.RABBITMQ_URL || 'amqp://rabbitmq:5672'],
                  queue: process.env.RABBITMQ_QUEUE || 'users_queue',
                  queueOptions: {
                      durable: false
                  },
              },
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

        formatError: (error) => {
          const graphQLFormattedError = {
              message: error.message,
              code: error.extensions?.code || 'SERVER_ERROR',
              locations: error.locations,
              path: error.path,
          };
          return graphQLFormattedError;
        },
      }),

      AuthModule,
      ProxyModule,
  ],
  controllers: [AppController],
  providers: [AppService, DateScalar],
})
export class AppModule {}
