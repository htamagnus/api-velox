import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly jwtIssuer: string;
  private readonly jwtAudience: string;
  private readonly jwtSecret: string;

  constructor(private readonly configService: ConfigService) {
    this.jwtIssuer = this.configService.getOrThrow('JWT_ISSUER');
    this.jwtAudience = this.configService.getOrThrow('JWT_AUDIENCE');
    this.jwtSecret = this.configService.getOrThrow('JWT_SECRET');
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token ausente'); // criar erro
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, this.jwtSecret, {
        algorithms: ['HS256'],
        issuer: this.jwtIssuer,
        audience: this.jwtAudience,
      });
      request.user = decoded;
      return true;
    } catch (error) {
      throw new UnauthorizedException(`Token inválido ${error.message}`); // criar erro
    }
  }
}
