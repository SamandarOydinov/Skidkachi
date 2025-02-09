import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function start() {
  try {
    let PORT = process.env.PORT ?? 3000;
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(new ValidationPipe());
    app.setGlobalPrefix('api');

    const config = new DocumentBuilder()
      .setTitle('Api example')
      .setDescription('The API description')
      .setVersion('1.0')
      .addTag('NESTJS, validation, swagger, guard, sequelize')
      .build();
    const document = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: { defaultModelsExpandDepth: -1 },
    });

    await app.listen(PORT, () => {
      console.log(`server http://localhost:${PORT}/api/docs da yurmoqda`);
    });
  } catch (error) {
    console.log(error.message);
  }
}

start();
