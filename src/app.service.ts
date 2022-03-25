import * as path from 'path';
import { Injectable } from '@nestjs/common';
import { convertExcelFileToJson, generateReportJSONFile, generateStoreProductJSONFile } from './utils/fileUtils';
import { ISourceData } from './interface/IStore';
import { buildReport, buildStoreProduct } from './biz/biz';

@Injectable()
export class AppService {

  private SOURCE_FILE_PATH = "D:/farmer/px-api/src/source";

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
}
