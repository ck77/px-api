import * as path from 'path';
import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { parseBufferToJson, generateJsonFile, fetchXlsxFile, getSellerData } from './utils/fileUtils';
import { buildStockReport } from './biz/biz';
import { IRankItem } from './interface/IStore';

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

  async getSellerReport(start: string, end: string, sid: number, eid: number) {

    let sellers = await getSellerData();

    for (let i = sid; i < eid; i++) {
      let url = `http://b2b1.pxstore.com.tw/carryProject.ashx?_NAME=fap.Query_Farmer&FARMER_ID=${i}&B_DATE=${start}&E_DATE=${end}&GROUP_TYPE=1&FILE_TYPE=0&_=${Date.now()}`

      const response = await this.getJsonData(url);

      if (response?.data?.length > 0) {
        const result = response.data.filter(x => x.ITEM_NAME == "小計")?.[0];

        const seller = {
          id: i,
          salePrice: result.SAL_PRICE
        }

        sellers.push(seller);
      }
    }

    const filePath = path.join('C:/papago/px-api/src/report', 'sellersReport.json');

    generateJsonFile(filePath, sellers)

    return sellers;
  }

  async sellerRank() {
    let sellers = await getSellerData();

    let sellerList = sellers.slice(0);
    sellerList.sort(function (a, b) {
      return b.salePrice - a.salePrice;
    });

    let result = sellerList.filter(x => x.salePrice > 500000);

    return sellerList;
  }

  async getItemRank(start: string, end: string) {

    let datas = [];

    for (let i = 4000; i < 4500; i++) {
      let url = `http://b2b1.pxstore.com.tw/carryProject.ashx?_NAME=fap.Query_Farmer&FARMER_ID=${i}&B_DATE=${start}&E_DATE=${end}&GROUP_TYPE=1&FILE_TYPE=0&_=${Date.now()}`
      const response = await this.getJsonData(url);
      if (response?.data?.length > 0) {

        const temp = response.data.filter(x => x.ITEM_NAME != "小計");
        datas = [...datas, ...temp];
      }
    }
    let collention: Array<IRankItem> = [];

    datas.forEach(data => {

      const ids = collention.map(x => x.id);

      const index = ids.indexOf(data.ITEM_ID);
      if (index > -1) {
        let target = collention[index];
        target.sales += data.SAL_QTY;
      } else {
        const temp: IRankItem = { id: data.ITEM_ID, name: data.ITEM_NAME, sales: data.SAL_QTY };
        collention.push(temp);
      }

      // if (ids.includes(data.ITEM_ID)) {
      //   let temp = collention.find(x => x.id == data.ITEM_ID)?.[0];

      //   console.log(temp);

      //   temp.sales += data.SAL_QTY;
      // } else {
      //   const temp: IRankItem = { id: data.ITEM_ID, name: data.ITEM_NAME, sales: data.SAL_QTY };
      //   collention.push(temp);
      // }
    });

    const result = collention.sort(this.compare);

    return result;
  }

  getJsonData = async (url: string) => {
    axios.defaults.timeout = 2147483647;

    try {
      const res = await axios({
        url,
        method: 'GET'
      });

      return res.data;
    } catch (error) {

    }
  }

  compare(a: IRankItem, b: IRankItem) {
    if (a.sales < b.sales) {
      return 1;
    }

    if (a.sales > b.sales) {
      return -1;
    }

    return 0;
  }
}
