import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { ProxyModule } from './proxy/proxy.module';
import { MessagingModule } from './messaging/messaging.module';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';

@Module({
  imports: [

      ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
      }),

      GraphQLModule.forRoot<ApolloDriverConfig>({
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        driver: ApolloDriver,
        sortSchema: true,
        playground: false,
        plugins: [ApolloServerPluginLandingPageLocalDefault()],
        context: ({ req }) => ({ req }),
        formatError: (error) => {
          // Personalizar el formato de errores
          const graphQLFormattedError = {
            message: error.message,
            code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
            locations: error.locations,
            path: error.path,
          };
          return graphQLFormattedError;
        },
      }),

      AuthModule,
      CommonModule,
      ProxyModule,
      MessagingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
