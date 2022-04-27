
import axios from 'axios';
import * as moment from "moment";
import { ISourceData, ISalesItem, IStore } from '../interface/IStore';
import { getSalesItemJSON, fetchXlsxFile, parseBufferToJson } from '../utils/fileUtils';

const SALE_REPORT_API = "http://b2b1.pxstore.com.tw/carryProject.ashx?";


export const buildStoreProduct = (sourceDatas: Array<any>) => {

    // read currentSalesItem
    const currentSalesItem = getSalesItemJSON() as Array<ISalesItem>;
    const currentSalesItemId = currentSalesItem.map((x) => {
        return x.id
    });

    let stores: Array<IStore> = [];

    sourceDatas.forEach(data => {

        const store = stores.find(x => x.id == data.__EMPTY_4);

        if (store) {
            if (currentSalesItemId.includes(data.__EMPTY_1)) {
                store.products.push({
                    id: data.__EMPTY_1,
                    name: data.__EMPTY_2
                });
            }
        } else {
            let tempStore: IStore = {
                id: data.__EMPTY_4,
                name: data.__EMPTY_5,
                products: []
            }

            if (currentSalesItemId.includes(data.__EMPTY_1)) {
                tempStore.products.push({
                    id: data.__EMPTY_1,
                    name: data.__EMPTY_2
                });
            }

            stores.push(tempStore);
        }
    });

    stores = stores.filter(x => x.products.length > 0);

    return stores;
}

export const buildStockReport = async (sourceDatas: Array<ISourceData>, month: number) => {

    const requestUrl = `http://b2b1.pxstore.com.tw/farmer/Dirstribution_Shp_export.ashx?BATCH_ID=${month}&FARMER_ID=4015`
    const xlsxFile = await fetchXlsxFile(requestUrl);
    const jsonData = parseBufferToJson(xlsxFile);
    const stores = buildStoreProduct(jsonData);

    const report = stores.map((store) => {

        const storeGroup = sourceDatas.filter(x => x.門市代號 == store.id);

        const products = store.products.map(product => {

            const itemGroup = storeGroup.filter(x => x.貨號 == product.id);

            const sales = itemGroup.map(x => x.銷售量).reduce((a, b) => a + b);
            const restock = itemGroup.map(x => x.進貨量).reduce((a, b) => a + b);
            const amount = itemGroup.map(x => x.銷售金額).reduce((a, b) => a + b);
            const defective = itemGroup.map(x => x.丟棄量).reduce((a, b) => a + b);
            const stock = restock - sales - defective;

            return {
                ...product,
                sales,
                amount,
                defective,
                restock,
                stock
            }
        });

        return {
            ...store,
            products
        }
    });

    return report;
}

export const buildSaleReport = async () => {
    let report = [];

    for (let index = 5; index > -1; index--) {
        let date = moment().subtract(index, 'days').format("YYYY-MM-DD");

        const temp = await dailySaleReport('4015', date);
        report.push(temp);
    }

    return report;
}

const dailySaleReport = async (id: string, date: string) => {
    const queryObj = {
        _NAME: 'fap.Query_Farmer',
        FARMER_ID: id,
        B_DATE: date,
        E_DATE: date,
        GROUP_TYPE: 1,
        FILE_TYPE: 0
    }

    const requestUrl = SALE_REPORT_API + buildQueryString(queryObj);
    const response = await getJsonData(requestUrl);

    const result = response.data.map((x) => {
        return {
            id: x.ITEM_ID,
            name: x.ITEM_NAME,
            sale: x.SAL_QTY,
            abandon: x.SCP_QTY,
            date
        }
    });

    return {
        date,
        products: result
    }
}

const buildQueryString = (params: any) => {
    return Object.keys(params).map(key => key + '=' + params[key]).join('&');
}

const getJsonData = async (url: string) => {
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
