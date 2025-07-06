import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe()); // <-- enables DTO validation
  if (process.env.NODE_ENV !== 'production') {
    await import('mongoose').then((mongoose) => mongoose.set('debug', true));
  }
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
