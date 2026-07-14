import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// ben trong co 1 ham.. de khoi dong
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
