import { MiddlewareConsumer, Module, NestModule  } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { UsersModule } from '../users/users.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { BlacklistService } from './blacklist.service';
import { BlacklistToken } from './blacklist-token.model';
import { TokenBlacklistMiddleware } from './token-blacklist.middleware';

// import { RedisService } from '../redis/redis.service';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: 'cH4#&r@',    // Gantilah dengan secret key yang kuat
      signOptions: { expiresIn: '1d' },
    }),
    SequelizeModule.forFeature([BlacklistToken]),
  ],
  providers: [
    AuthService, 
    LocalStrategy, 
    JwtStrategy, 
    BlacklistService,
    {
      provide: 'ON_MODULE_INIT',
      useFactory: (blacklistService: BlacklistService) => async () => {
        await blacklistService.cleanupExpiredTokens();
      },
      inject: [BlacklistService],
    },
  ],
  controllers: [AuthController],
  exports: [AuthService, BlacklistService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TokenBlacklistMiddleware)
      .forRoutes('*'); // Terapkan middleware untuk semua rute
  }
}
