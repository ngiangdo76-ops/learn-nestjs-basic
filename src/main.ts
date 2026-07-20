import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ValidationError } from 'class-validator';
import { AppModule } from './app.module';
// import { LoggingMiddleware } from './middleware/logging/logging.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.use(new LoggingMiddleware().use);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new BadRequestException(
          validationErrors.map((error) => ({
            [error.property]: error.constraints
              ? Object.values(error.constraints)[0]
              : 'Invalid value',
          })),
        );
      },
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
