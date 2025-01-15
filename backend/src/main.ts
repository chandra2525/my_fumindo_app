import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import * as express from 'express';
// import { JwtBlacklistMiddleware } from './auth/middleware/jwt-blacklist.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Pastikan body parsing aktif
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors();
  // app.use('/protected-route', JwtBlacklistMiddleware);
// 
  // Aktifkan CORS untuk mengizinkan akses dari origin lain
  // app.enableCors({
  //   origin: 'http://localhost:8080',  // URL frontend
  // });

  // Aktifkan CORS dan izinkan dua origin
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:8080', 'http://192.168.0.174:8080'], // Tambahkan origins yang diizinkan
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Jika Anda perlu menggunakan kredensial (cookies, auth headers, dll.)
  });

  // Mengatur folder 'qr_code_image' agar dapat diakses sebagai file statis
  app.use('/qr_code_image', express.static(join(__dirname, '..', 'qr_code_image')));
  
  app.setGlobalPrefix('api'); // Menambahkan global prefix 'api' untuk semua route
  await app.listen(3000);
}
bootstrap();
