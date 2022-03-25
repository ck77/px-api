import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('store/:month')
  getStoreProduct(@Param('month') month: number): any {
    return this.appService.getStoreProduct(month);
  }

  @Get('report/:date')
  getDailyReport(@Param('date') date: number): any {
    return this.appService.getReport(date);
  }
}
