// import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
// import { RedisService } from '../../redis/redis.service';
// import { Request, Response, NextFunction } from 'express';
// import { JwtService } from '@nestjs/jwt';

// @Injectable()
// export class JwtBlacklistMiddleware implements NestMiddleware {
//   constructor(
//     private readonly redisService: RedisService,
//     private readonly jwtService: JwtService,
//   ) {}

//   async use(req: Request, res: Response, next: NextFunction) {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       throw new UnauthorizedException('Missing or invalid token');
//     }

//     const token = authHeader.split(' ')[1];

//     if (await this.redisService.isBlacklisted(token)) {
//       throw new UnauthorizedException('Token has been blacklisted');
//     }

//     try {
//       const decoded = this.jwtService.verify(token);
//       req['user'] = decoded;
//     } catch (err) {
//       throw new UnauthorizedException('Invalid token');
//     }

//     next();
//   }
// }
