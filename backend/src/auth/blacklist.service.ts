import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/sequelize';
import { BlacklistToken } from './blacklist-token.model';
import { Op } from 'sequelize';

@Injectable()
export class BlacklistService {
  private readonly logger = new Logger(BlacklistService.name);

  constructor(
    @InjectModel(BlacklistToken)
    private readonly blacklistModel: typeof BlacklistToken,
  ) {}

  async addToken(token: string, expiresIn: number): Promise<void> {
    const expiredAt = new Date(Date.now() + expiresIn * 1000);
    await this.blacklistModel.create({ token, expired_at: expiredAt });
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const result = await this.blacklistModel.findOne({
      where: { token },
    });
    return !!result;
  }

  async cleanupExpiredTokens(): Promise<void> {
    const now = new Date();
    const deleted = await this.blacklistModel.destroy({
      where: { expired_at: { [Op.lt]: now } },
    });
    this.logger.log(`Deleted ${deleted} expired tokens`);
  }

  @Cron(CronExpression.EVERY_10_MINUTES) // Panggil setiap hari pada tengah malam
  async handleScheduledCleanup(): Promise<void> {
    this.logger.log('Running scheduled cleanup for expired tokens...');
    await this.cleanupExpiredTokens();
  }
  
  // async cleanupExpiredTokens(): Promise<void> {
  //   const now = new Date();
  //   await this.blacklistModel.destroy({
  //     where: { expired_at: { [Op.lt]: now } },
  //   });
  // }
}
