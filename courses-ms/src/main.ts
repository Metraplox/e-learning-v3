import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://rabbitmq:5672'],
      queue: process.env.RABBITMQ_QUEUE || 'courses_queue',
      queueOptions: {
        durable: false
      },
      noAck: false,
      prefetchCount: 1,
      persistent: true,
    },
  });

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3001);

  console.log(`Courses microservice is running on port ${process.env.PORT ?? 3001}`);
}
bootstrap();