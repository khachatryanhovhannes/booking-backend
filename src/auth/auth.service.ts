import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignInDto, SignUpDto } from './dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwt: JwtService,
    private configService: ConfigService,
  ) {}
  async signup(dto: SignUpDto) {
    try {
      const existingUser = await this.prismaService.user.findUnique({
        where: { email: dto.email },
      });

      if (existingUser) {
        return new ForbiddenException(`User ${dto.email} already exists`);
      }

      const hash = await argon.hash(dto.password);

      const user = await this.prismaService.user.create({
        data: {
          ...dto,
          password: hash,
        },
      });

      return user;
    } catch (err) {
      return new InternalServerErrorException(err);
    }
  }

  async signin(dto: SignInDto) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { email: dto.email },
      });

      if (!user || !(await argon.verify(user.password, dto.password))) {
        return new ForbiddenException('Invalid credentials');
      }

      const access_token = await this.signToken(user.id, user.email);
      return { access_token };
    } catch (err) {
      return new InternalServerErrorException(err);
    }
  }

  async signToken(id: number, email: string): Promise<string> {
    const payload = { sub: id, email };

    return this.jwt.signAsync(payload, {
      expiresIn: '1h',
      secret: this.configService.get<string>('JWT_SECRET'),
    });
  }
}
