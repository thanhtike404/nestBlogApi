import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'; // --- 1. Import Swagger ---

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

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();