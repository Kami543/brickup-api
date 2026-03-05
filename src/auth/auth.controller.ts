import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Put,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type { Request } from 'express'; // Changed to import type
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Adjust based on your throttler version
  @Throttle(5, 60) // or @Throttle({ limit: 5, ttl: 60 })
  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @Post('refresh')
  async refresh(@Body() body: { userId: string; refreshToken: string }) {
    return this.authService.refresh(body.userId, body.refreshToken);
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  async logout(@Req() req: Request) {
    const user = req.user as User;
    await this.authService.logout(user.id);
    return { message: 'Logout realizado com sucesso' };
  }

  @UseGuards(AuthGuard)
  @Put('change-password')
  async changePassword(
    @Req() req: Request,
    @Body() body: { newPassword: string },
  ) {
    const user = req.user as User;
    await this.authService.changePassword(user.id, body.newPassword);
    return { message: 'Senha alterada com sucesso' };
  }
}