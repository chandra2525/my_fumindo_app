import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { BlacklistService } from './blacklist.service';

@Injectable()
export class TokenBlacklistMiddleware implements NestMiddleware {
  constructor(private readonly blacklistService: BlacklistService) {}

  async use(req: any, res: any, next: () => void) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      const isBlacklisted = await this.blacklistService.isTokenBlacklisted(token);
      if (isBlacklisted) {
        throw new UnauthorizedException('Token has been blacklisted');
      }
    }
    next();
  }
}
