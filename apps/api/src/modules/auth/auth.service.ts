import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UsersService } from '../users/users.service';
import { RegisterDto, LoginDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    // Check if user already exists
    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const hash = await argon2.hash(dto.password);
    const user = await this.usersService.create({
      email: dto.email,
      name: dto.name,
      phone: dto.phone,
      hash,
    });

    const tokens = await this.getTokens(user._id.toString(), user.email, user.role);
    await this.usersService.updateRefreshToken(user._id.toString(), tokens.refreshToken);

    return { user: this.sanitizeUser(user), ...tokens };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await argon2.verify(user.hash, dto.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const tokens = await this.getTokens(user._id.toString(), user.email, user.role);
    await this.usersService.updateRefreshToken(user._id.toString(), tokens.refreshToken);

    return { user: this.sanitizeUser(user), ...tokens };
  }

  async refreshTokens(userId: string) {
    const user = await this.usersService.findOne(userId);
    if (!user) throw new UnauthorizedException();

    return this.getTokens(user._id.toString(), user.email, user.role);
  }

  async logout(userId: string) {
    await this.usersService.updateRefreshToken(userId, null);
  }

  private async getTokens(userId: string, email: string, role: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(
        { sub: userId, email, role },
        { secret: process.env.JWT_SECRET, expiresIn: process.env.JWT_EXPIRES_IN || '15m' },
      ),
      this.jwt.signAsync(
        { sub: userId, email, role },
        { secret: process.env.REFRESH_SECRET, expiresIn: process.env.REFRESH_EXPIRES_IN || '7d' },
      ),
    ]);

    return { accessToken, refreshToken };
  }

  private sanitizeUser(user: any) {
    const { hash, refreshToken, __v, ...result } = user.toObject ? user.toObject() : user;
    return result;
  }
}