import { Injectable, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(private configService: ConfigService) {}

  validateLogin(username: string, password: string): string {
    const validUsername = this.configService.get<string>('AUTH_USERNAME');
    const validPassword = this.configService.get<string>('AUTH_PASSWORD');

    if (!validUsername || !validPassword) {
      throw new InternalServerErrorException('Authentication is not configured');
    }

    if (username !== validUsername || password !== validPassword) {
      throw new UnauthorizedException('Galat username ya password');
    }

    return this.generateToken(validUsername);
  }

  verifyToken(token: string): boolean {
    const validUsername = this.configService.get<string>('AUTH_USERNAME');
    if (!validUsername) {
      throw new InternalServerErrorException('Authentication is not configured');
    }

    const expectedToken = this.generateToken(validUsername);
    return token === expectedToken;
  }

  private generateToken(username: string): string {
    const secret = this.configService.get<string>('AUTH_SECRET');
    if (!secret) {
      throw new InternalServerErrorException('Authentication secret is not configured');
    }

    return crypto.createHmac('sha256', secret).update(username).digest('hex');
  }
}
