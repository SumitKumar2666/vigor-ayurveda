import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto, LoginDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const hash = await argon2.hash(dto.password);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        phone: dto.phone,
        hash,
      },
    });

    const tokens = await this.getTokens(user.id, user.email);
    return { user: this.sanitizeUser(user), ...tokens };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await argon2.verify(user.hash, dto.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const tokens = await this.getTokens(user.id, user.email);
    return { user: this.sanitizeUser(user), ...tokens };
  }

  async refreshTokens(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException();

    return this.getTokens(user.id, user.email);
  }

  private async getTokens(userId: string, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(
        { sub: userId, email },
        { secret: process.env.JWT_SECRET, expiresIn: process.env.JWT_EXPIRES_IN || '15m' },
      ),
      this.jwt.signAsync(
        { sub: userId, email },
        { secret: process.env.REFRESH_SECRET, expiresIn: process.env.REFRESH_EXPIRES_IN || '7d' },
      ),
    ]);

    return { accessToken, refreshToken };
  }

  private sanitizeUser(user: any) {
    const { hash, ...result } = user;
    return result;
  }
}