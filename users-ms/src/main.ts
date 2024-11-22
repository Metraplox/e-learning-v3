import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Users-MS');
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://guest:guest@rabbitmq:5672'],
      queue: process.env.RABBITMQ_QUEUE || 'users_queue',
      prefetchCount: 1,
      isGlobalPrefetchCount: true,
      noAck: false,
      socketOptions: {
        heartbeatIntervalInSeconds: 60,
        reconnectTimeInSeconds: 5,
      },
    },
  });

  try {
    await app.startAllMicroservices();
    logger.log('Users Microservice is running');
    await app.listen(process.env.PORT ?? 3000);
    logger.log(`Users HTTP server is running on: ${await app.getUrl()}`);
  } catch (error) {
    logger.error('Error starting microservice:', error);
    process.exit(1);
  }
}
bootstrap();