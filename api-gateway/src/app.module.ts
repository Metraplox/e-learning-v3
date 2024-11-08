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
            return {
              message: error.message,
              code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
              locations: error.locations,
              path: error.path,
          };
        },
      }),

      AuthModule,
      ProxyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
