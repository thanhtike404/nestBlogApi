import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'; // --- 1. Import Swagger ---
import { BigIntSerializeInterceptor } from './interceptors/bigint-serialize.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // --- 2. Create Swagger Configuration ---
  const config = new DocumentBuilder()
    .setTitle('My Tech Blog API')
    .setDescription('API documentation for the tech blog')
    .setVersion('1.0')
    .addTag('posts', 'Endpoints related to blog posts') // Add tags for each module
    .addTag('users', 'Endpoints related to users')
    .build();

  // --- 3. Create and Setup Swagger Document ---
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document); // This sets up the UI at /api-docs

  // Register global interceptor to serialize BigInt values to strings for JSON
  app.useGlobalInterceptors(new BigIntSerializeInterceptor());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
