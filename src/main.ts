import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({whitelist: true, forbidNonWhitelisted: true}));
  
  const config = new DocumentBuilder()
    .setTitle('Práctica III')
    .setDescription('API con registro, inicio de sesión, y CRUD protegido de direccion')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer("http://localhost:3000", "Servidor local")
    .addServer("https://practica-3-ttav.onrender.com", "Server de producción")
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
