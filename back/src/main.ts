import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { DomainErrorFilter } from './shared/infrastructure/http/domain-error.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  const rawOrigins =
    process.env.CORS_ORIGIN || 'http://localhost:3000,http://localhost:3001';
  const allowedOrigins = rawOrigins
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (
        err: Error | null,
        origin?: boolean | string | RegExp | (string | RegExp)[],
      ) => void,
    ) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, origin || true);
      }
      return callback(null, allowedOrigins[0]);
    },
    credentials: true,
  });

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new DomainErrorFilter());
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
