import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('stock/report/:start/:end/:month')
  getStockReport(
    @Param('start') start: string,
    @Param('end') end: string,
    @Param('month') month: number) {
    return this.appService.getStockReport(start, end, month);
  }
}
