import { Injectable } from '@nestjs/common';
import { convertExcelFileToJson, generateReportJSONFile } from './utils/fileUtils';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getReport(date: string): any {
    const report = convertExcelFileToJson(date);
    const fileName = date + "_report.json"
    generateReportJSONFile(report, fileName)

    return report;
  }
}
