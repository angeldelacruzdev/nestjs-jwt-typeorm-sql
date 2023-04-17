import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  app.use(compression({ encodings: ['gzip', 'deflate', 'x-gzip', 'br'] }));

  var corsOption: CorsOptions = {
    origin: [process.env.ORGIN_FRONT, process.env.ORIGIN_FRONT_ADMIN],
  };

  app.use(helmet.hidePoweredBy());
  app.enableCors(corsOption);

  const PORT = process.env.PORT || 3043;
  await app.listen(PORT);
}
bootstrap();
