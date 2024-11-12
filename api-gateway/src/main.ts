import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:5000',
    credentials: true,
  });

  // Solo una llamada a listen
  await app.listen(process.env.PORT ?? 4000);
}