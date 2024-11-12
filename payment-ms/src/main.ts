import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

import { RabbitMQ } from './common/constants';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
    transport: Transport.RMQ,
    options: {
      // Usar la URL de RabbitMQ configurada como variable de entorno
      urls: [process.env.RABBITMQ_URL || 'amqp://rabbitmq:5672'],  // RabbitMQ está en el contenedor "rabbitmq" en la red de Docker
      queue: RabbitMQ.PaymentQueue,  // Asegúrate de que esta constante esté correctamente definida en ./common/constants
      queueOptions: { durable: true },
    },
  });

  // Configuración global de pipes y serializadores
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // Escuchar para conexiones
  await app.listen();
  console.log('Payment Microservice is listening');
}

bootstrap();
