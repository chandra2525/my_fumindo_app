import { Controller, Post, Request, UseGuards, Body, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
// import { AuthGuard } from '@nestjs/passport';
import { BlacklistService } from './blacklist.service';
// import { RedisService } from '../redis/redis.service';

@Controller('auth')
export class AuthController {
  // constructor(private authService: AuthService) {}
  constructor(
    private authService: AuthService,
    private readonly blacklistService: BlacklistService
    // private readonly redisService: RedisService,
  ) {}

//   constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    // return this.authService.login(req.user);
    const user = await this.authService.validateUser(req.body.username, req.body.password);
    if (!user) {
      return { message: 'Invalid credentials or access denied.' };
    }
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  async refresh(@Body('refresh_token') refreshToken: string) {
    return this.authService.refresh(refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req): Promise<{ message: string }> {
    const token = req.headers.authorization.split(' ')[1]; // Ambil token dari header
    const expiresIn = 24 * 60 * 60; // Atur durasi token (misal 24 jam)
    await this.blacklistService.addToken(token, expiresIn);
    return { message: 'Logout successful and token blacklisted' };
  }
  // @UseGuards(AuthGuard('jwt'))
  // @Post('logout')
  // async logout(@Req() req) {
  //   const token = req.headers.authorization.split(' ')[1];
  //   const expiresIn = 24 * 60 * 60; // Sesuaikan dengan durasi JWT (1 hari dalam detik)
  //   await this.redisService.addToBlacklist(token, expiresIn);

  //   return { message: 'Logout successful' };
  // }
}
