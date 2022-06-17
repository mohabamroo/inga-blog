import {
  Controller,
  UseGuards,
  Request,
  Post,
  Body,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { PrismaClient, Prisma } from '@prisma/client';
import { Public } from './constants';
import { CreateUserDto } from './dto/create-user.dto';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    try {
      return this.authService.login(req.user);
    } catch (err) {
      throw new UnauthorizedException();
    }
  }

  @Public()
  @Post('register')
  async register(@Body() userCreateDto: CreateUserDto) {
    // TODO: send verification email
    try {
      const { password, ...user } = await this.userService.createUser(
        userCreateDto,
      );

      const tokenRes = await this.authService.login(user);
      return { ...tokenRes, user };
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // The .code property can be accessed in a type-safe manner
        if (e.code === 'P2002') {
          throw new BadRequestException('Email already exists');
        }
      }
      throw new BadRequestException('Failed to register');
    }
  }
}
