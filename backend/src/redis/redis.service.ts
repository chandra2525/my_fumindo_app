// import { Injectable } from '@nestjs/common';
// import Redis from 'ioredis';

// @Injectable()
// export class RedisService {
//   private readonly redis: Redis;

//   constructor() {
//     this.redis = new Redis({
//       host: '127.0.0.1', // Ganti dengan host Redis Anda
//       port: 6379,        // Ganti dengan port Redis Anda
//     });
//   }

//   async addToBlacklist(token: string, expiresIn: number): Promise<void> {
//     await this.redis.set(token, 'blacklisted', 'EX', expiresIn);
//   }

//   async isBlacklisted(token: string): Promise<boolean> {
//     const result = await this.redis.get(token);
//     return result === 'blacklisted';
//   }
// }
