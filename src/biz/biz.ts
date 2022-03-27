
import { ISourceData, ISalesItem, IStore } from '../interface/IStore';
import { getSalesItemJSON, fetchXlsxFile, parseBufferToJson } from '../utils/fileUtils';

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

const productAnalysis = (sourceDatas: Array<ISourceData>) => {
    const currentSalesItem = getSalesItemJSON() as Array<ISalesItem>;
    let analysis = currentSalesItem.map((item) => {

        const itemGroup = sourceDatas.filter(x => x.貨號 == item.id);
        const sales = itemGroup.map(x => x.銷售量).reduce((a, b) => a + b);
        const restock = itemGroup.map(x => x.進貨量).reduce((a, b) => a + b);
        const amount = itemGroup.map(x => x.銷售金額).reduce((a, b) => a + b);
        const defective = itemGroup.map(x => x.丟棄量).reduce((a, b) => a + b);

        return {
            ...item,
            sales,
            amount,
            defective,
            restock
        }
    });

    return analysis;
}