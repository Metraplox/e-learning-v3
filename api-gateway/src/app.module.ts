import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ProxyModule } from './proxy/proxy.module';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DateScalar } from "./common/date.scalar";
import { PaymentController } from './payment/payment.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Configuración del microservicio de usuarios
    ClientsModule.register([
      {
        name: 'USERS_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://rabbitmq:5672'],
          queue: process.env.RABBITMQ_QUEUE || 'users_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
      // Configuración del microservicio de pagos
      {
        name: 'PAYMENT_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://rabbitmq:5672'],
          queue: process.env.RABBITMQ_PAYMENT_QUEUE || 'payment_queue', // Asegúrate de que coincida con el nombre de la cola del microservicio de pagos
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),

    // Configuración de GraphQL
    GraphQLModule.forRoot<ApolloDriverConfig>({
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
  controllers: [AppController,PaymentController],
  providers: [AppService, DateScalar],
})
export class AppModule {}
