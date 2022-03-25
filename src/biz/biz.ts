
import { ISourceData, ISalesItem, IStore, IProduct } from '../interface/IStore';
import { getCurrentSalesItem, getPreReport } from '../utils/fileUtils';

const START_DATE = 20220314;

export const buildReport = (sourceDatas: Array<ISourceData>, date: number) => {
    const stores = getStores(sourceDatas);

    const currentSalesItem = getCurrentSalesItem() as Array<ISalesItem>;
    const currentSalesItemId = currentSalesItem.map((x) => {
        return x.id
    });

    let report = stores.map((store) => {

        let storeInfo: IStore = {
            id: store.id,
            name: store.name,
            products: []
        }

        let filtered = sourceDatas.filter((x) => {
            return x.門市代號 == store.id
        });

        filtered = filtered.filter((x) => {
            return currentSalesItemId.includes(x.貨號)
        });

        filtered.forEach(x => {

            let productInfo: IProduct = {
                id: x.貨號,
                name: x.商品名稱,
                sales: x.銷售量,
                amount: x.銷售金額,
                defective: x.丟棄量,
                restock: x.進貨量,
                stock: 0
            }

            storeInfo.products.push(productInfo);
        });

        return storeInfo
    });

    report = report.filter((x) => {
        return x.products.length > 0
    });

    if (date != START_DATE) {
        const preReport = getPreReport(date) as Array<IStore>;

        report.forEach(store => {

            const preReportStore = preReport.find(x => x.id == store.id);
            if (!preReportStore || preReportStore.products.length == 0) {
                return;
            }

            store.products.forEach((product) => {

                const preProduct = preReportStore.products.find(x => x.id == product.id);
                if (!preProduct) {
                    return;
                }

                if (preProduct.stock > 0) {
                    product.stock = preProduct.stock - product.sales - product.defective;
                }

                if (product.restock > 0) {
                    product.stock = product.restock - product.sales;
                }
            });
        });
    }

    return report;
}

export const buildStoreProduct = (sourceDatas: Array<any>) => {

    // read currentSalesItem
    const currentSalesItem = getCurrentSalesItem() as Array<ISalesItem>;
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

const getStores = (sourceDatas: Array<ISourceData>) => {
    let uniqueObjArray = [
        ...new Map(sourceDatas.map((item) => [item["門市代號"], item])).values(),
    ];

    const stores = uniqueObjArray.map((x) => {
        return {
            id: x.門市代號,
            name: x.門市名稱
        }
    });

    return stores;
}