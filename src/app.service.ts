import * as path from 'path';
import { Injectable } from '@nestjs/common';
import { parseBufferToJson, generateJsonFile, fetchXlsxFile } from './utils/fileUtils';
import { buildStockReport } from './biz/biz';

@Injectable()
export class AppService {

  private DIST_FILE_PATH = "D:/farmer/px-api/src/report";

  getHello(): string {
    return 'Hello World!';
  }

  async getStockReport(start: string, end: string, month: number) {

    const requestUrl = `http://b2b1.pxstore.com.tw/farmer/Query_Report.ashx?B_DATE=${start}&E_DATE=${end}&GROUP_TYPE=2&FARMER_ID=4015`;
    const xlsxFile = await fetchXlsxFile(requestUrl);
    const jsonData = parseBufferToJson(xlsxFile);
    const report = await buildStockReport(jsonData, month);

    const filePath = path.join(this.DIST_FILE_PATH, 'report.json');

    generateJsonFile(filePath, report);

    return report;
  }
}
