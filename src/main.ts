import * as express from 'express';
import * as helmet from 'helmet';
import { ConfigService } from 'nestjs-config';
import { join } from 'path';

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AllExceptionsFilter } from './app/_common/filters';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const { port, publicFolderPath, servePublic, apiPrefix } = config.get(
    'express',
  );
  const publicResources = join(process.cwd(), publicFolderPath);

  app.enableCors();
  app.use(helmet());
  if (servePublic) {
    app.use(express.static(publicResources));
    app.use((req, res, next) => {
      if (req.path.includes(`/${apiPrefix}`)) {
        return next();
      }
      const indexFilePath = join(publicResources, 'index.html');
      res.sendFile(indexFilePath);
    });
  }
  app.setGlobalPrefix(apiPrefix);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new AllExceptionsFilter());

  const options = new DocumentBuilder()
    .setTitle('Address Book Api')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(`${apiPrefix}/documentation`, app, document);

  await app.listen(port);
}
bootstrap();
