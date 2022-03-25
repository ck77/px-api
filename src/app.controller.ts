import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('report/:date')
  getDailyReport(@Param('date') date: string): any {
    return this.appService.getReport(date);
  }
}
