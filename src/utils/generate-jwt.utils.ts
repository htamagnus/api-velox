import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
  private readonly jwtIssuer: string;
  private readonly jwtAudience: string;
  private readonly jwtSecret: string;

  constructor(protected readonly configService: ConfigService) {
    this.jwtIssuer = this.configService.getOrThrow('JWT_ISSUER');
    this.jwtAudience = this.configService.getOrThrow('JWT_AUDIENCE');
    this.jwtSecret = this.configService.getOrThrow('JWT_SECRET');
  }

  public async generateAuthToken(
    athleteId: string,
  ): Promise<{ token: string; expiresIn: number }> {
    const payload: jwt.JwtPayload = {
      athleteId,
    };

    const signOptions: jwt.SignOptions = {
      algorithm: 'HS256',
      expiresIn: '3h',
      issuer: this.jwtIssuer,
      audience: this.jwtAudience,
    };

    const token = jwt.sign(payload, this.jwtSecret, signOptions);
    return { token, expiresIn: 3600 };
  }
}
