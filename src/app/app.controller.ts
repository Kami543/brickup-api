import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  @Get('ok')
  getHello(): string {
    this.logger.log('Endpoint /ok acessado');
    return this.appService.getHello();
  }

  @Get('health')
  getHealth() {
    this.logger.log('Health check acessado');
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
    };
  }
}