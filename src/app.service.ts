import * as path from 'path';
import axios from 'axios';
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

  async getSellerReport(start: string, end: string) {

    let sellers = []

    for (let index = 4000; index < 5000; index++) {
      let url = `http://b2b1.pxstore.com.tw/carryProject.ashx?_NAME=fap.Query_Farmer&FARMER_ID=${index}&B_DATE=${start}&E_DATE=${end}&GROUP_TYPE=1&FILE_TYPE=0&_=${Date.now()}`

     
      const { data } = await this.getJsonData(url);

      if (data.length > 0) {
        const result = data.filter(x => x.ITEM_NAME == "小計")?.[0];

        const seller = {
          id: index,
          salePrice: result.SAL_PRICE
        }

        console.log(seller);


        sellers.push(seller);
      }

    }

    const filePath = path.join('C:/papago/px-api/src/report', 'sellersReport.json');

    generateJsonFile(filePath, sellers)

    return sellers;
  }

  getJsonData = async (url: string) => {


    axios.defaults.timeout = 2147483647;
    // axios.defaults.httpsAgent = new https.Agent({ keepAlive: true });

    
    const res = await axios({
      url,
      method: 'GET'
    });

    return res.data;
  }
}
