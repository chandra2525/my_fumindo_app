import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findUser(username);
    if (user && (await bcrypt.compare(pass, user.password))) {
      // const { password, ...result } = user.toJSON();
      // return result;
      const { user_id, username, role } = user.toJSON();
      // if (role === 'Petugas Lapangan') {
      //   return { user_id, username, role };
      // }
      return { user_id, username, role };
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.user_id, role: user.role };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1d' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' }); // Refresh token valid 7 hari
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user_id: user.user_id,
      username: user.username,
      role: user.role,
    };
  }

  async refresh(refreshToken: string) {
    try {
      if (!refreshToken) {
        throw new UnauthorizedException('Refresh token is missing');
      }
      const payload = this.jwtService.verify(refreshToken);
      const accessToken = this.jwtService.sign({ username: payload.username, sub: payload.sub }, { expiresIn: '1d' });
      return { access_token: accessToken };
    } catch (error) {
      console.error('Refresh token error:', error.message); // Log error untuk debugging
      throw new UnauthorizedException(error.message);
    }
  }
}
