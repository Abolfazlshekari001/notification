import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as basicAuth from 'express-basic-auth';
import { infoLogger } from './Configs/winston/winston.config';
import { HttpExceptionFilter } from './Common/filter/Http-message-Handler';
import { applicationDefault, getApps, initializeApp } from 'firebase-admin/app';
import { ConfigService } from '@nestjs/config';
dotenv.config({
  path: `${process.env.NODE_ENV}.env`,
});




async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    }),
  );
 
    if (getApps().length === 0) {
      initializeApp({
        credential: applicationDefault(),
        projectId: 'notification-simorgh',
      });
    } else {
      console.log('Firebase app already initialized.');
    }
  
  
  app.use(
    ['/docs', '/docs-json'],
    basicAuth({
      challenge: true,
      users: {
        [process.env.SWAGGER_USERNAME]: process.env.SWAGGER_PASSWORD,
      },
    }),
  );
  app.enableCors();
  app.use(passport.initialize());
  app.use(passport.session());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  const options = new DocumentBuilder()
    .setTitle('notifications')
    .setDescription('The notifications API description')
    .setVersion('0.0.1')
    .addBearerAuth()
    .addTag('')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);
  const port = process.env.SERVER_PORT;
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(port);
  const info = {
    timestamp: new Date().toISOString(),
    message: `The server listens on port ${port}`,
  };
  infoLogger.info(info);
}
bootstrap();
