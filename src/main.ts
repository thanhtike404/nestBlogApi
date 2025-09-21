import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'; // --- 1. Import Swagger ---
import { BigIntSerializeInterceptor } from './interceptors/bigint-serialize.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('My Tech Blog API')
    .setDescription('API documentation for the tech blog')
    .setVersion('1.0')
    .addTag('posts', 'Endpoints related to blog posts')
    .addTag('users', 'Endpoints related to users')
    .addTag('auth')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();


  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);


  app.useGlobalInterceptors(new BigIntSerializeInterceptor());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
