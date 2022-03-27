import * as path from 'path';
import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { convertExcelFileToJson, generateReportJSONFile, generateStoreProductJSONFile, writeFile, parseBufferToJson } from './utils/fileUtils';
import { ISourceData } from './interface/IStore';
import { buildReport, buildStoreProduct } from './biz/biz';

@Injectable()
export class AppService {

  private SOURCE_FILE_PATH = "D:/farmer/px-api/src/source";
  private DIST_FILE_PATH = "D:/farmer/px-api/src/report";

  getHello(): string {
    return 'Hello World!';
  }

  getReport(month: number, date: number) {
    const sourceFileName = date + '.xlsx';
    const sourceFilePath = path.join(this.SOURCE_FILE_PATH, sourceFileName);
    const sourceDatas = convertExcelFileToJson(sourceFilePath) as Array<ISourceData>;
    const report = buildReport(sourceDatas, date, month);
    generateReportJSONFile(report, date)
    return report;
  }

  getStoreProduct(month: number) {
    const sourceFileName = month + '.xlsx';
    const sourceFilePath = path.join(this.SOURCE_FILE_PATH, sourceFileName);
    const sourceDatas = convertExcelFileToJson(sourceFilePath);
    const storeProduct = buildStoreProduct(sourceDatas);
    generateStoreProductJSONFile(storeProduct, month);
    return storeProduct;
  }

  loadXlsxFile(start: string, end: string) {
    const requestUrl = `http://b2b1.pxstore.com.tw/farmer/Query_Report.ashx?B_DATE=${start}&E_DATE=${end}&GROUP_TYPE=2&FARMER_ID=4015`;
    axios.request({
      responseType: 'arraybuffer',
      url: requestUrl,
      method: 'get',
      headers: {
        'Content-Type': 'blob',
      }
    }).then((result) => {
      const sourceData = parseBufferToJson(result.data);
      const fileName = `${start}_${end}_report.json`;
      const distFilePath = path.join(this.DIST_FILE_PATH, fileName);

      writeFile(distFilePath, sourceData);
    });
  }
}
