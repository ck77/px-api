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

  @Get('report/:month/:date')
  getDailyReport(@Param('month') month: number, @Param('date') date: number): any {
    return this.appService.getReport(month, date);
  }

  @Get('loadXlsx/:start/:end')
  loadXlsx(@Param('start') start: string, @Param('end') end: string) {
    this.appService.loadXlsxFile(start, end);
  }
}
