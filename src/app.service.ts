import { Injectable } from '@nestjs/common';
import { convertExcelFileToJson, generateReportJSONFile } from './utils/fileUtils';
import { ISourceData } from './interface/IStore';
import { getReport } from './biz/biz';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getReport(date: number) {
    const sourceDatas = convertExcelFileToJson(date) as Array<ISourceData>;
    const report = getReport(sourceDatas, date);

    generateReportJSONFile(report, date)

    return report;
  }
}
