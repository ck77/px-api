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

  @Get('seller/:start/:end/:sid/:eid')
  getSellerReport(
    @Param('start') start: string,
    @Param('end') end: string,
    @Param('sid') sid: number,
    @Param('eid') eid: number) {
    return this.appService.getSellerReport(start, end, sid, eid);
  }

  @Get('sellerRank')
  getSellerRank() {
    return this.appService.sellerRank();
  }

  @Get('itemRank/:start/:end')
  getItemRank(
    @Param('start') start: string,
    @Param('end') end: string
  ) {
    return this.appService.getItemRank(start, end);
  }
}
