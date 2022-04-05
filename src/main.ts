import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const servr = await app.listen(3000);
  servr.setTimeout(3600000);
}
bootstrap();
