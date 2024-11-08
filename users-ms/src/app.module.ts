import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';

@Module({
  imports: [
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
      TypeOrmModule.forRoot({
        type: 'postgres',
        host: 'users_postgres_db',
        port: 5432,
        username: 'postgres',
        password: 'postgres',
        database: 'users_db',
        autoLoadEntities: true,
        synchronize: true,
        logging: true,
        retryAttempts: 10,
        retryDelay: 3000,
        keepConnectionAlive: true,
      }),
      UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
