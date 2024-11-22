import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Couses-MS');

  // Crear la aplicación NestJS
  const app = await NestFactory.create(AppModule);

  // Configurar el microservicio
  const microserviceOptions: MicroserviceOptions = {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://rabbitmq:5672'],
      queue: process.env.RABBITMQ_QUEUE || 'courses_queue',
      prefetchCount: 1,
      isGlobalPrefetchCount: true,
      noAck: false,
      socketOptions: {
        heartbeatIntervalInSeconds: 60,
        reconnectTimeInSeconds: 5,
      },
    },
  };

  // Conectar el microservicio
  app.connectMicroservice(microserviceOptions);

  try {
    // Iniciar el microservicio
    await app.startAllMicroservices();
    logger.log('Courses Microservice is running');

    // Iniciar el servidor HTTP
    await app.listen(process.env.PORT || 3001);
    logger.log(`Courses HTTP server is running on: ${await app.getUrl()}`);
  } catch (error) {
    logger.error('Failed to start Courses Microservice:', error);
    // No usar process.exit aquí, permite que el contenedor reinicie
    throw error;
  }
}

// Manejar rechazos de promesas no capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

bootstrap();