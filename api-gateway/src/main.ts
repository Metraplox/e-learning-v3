import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Main');
  const app = await NestFactory.create(AppModule);

  // Mantener CORS existente
  app.enableCors({
    origin: 'http://localhost:5000',
    credentials: true,
  });

  try {
    // Eliminar la configuración de microservicio
    await app.listen(process.env.PORT || 4000);
    logger.log(`Application is running on: ${await app.getUrl()}`);
  } catch (error) {
    logger.error('Failed to start application:', error);
    process.exit(1);
  }
}
bootstrap();