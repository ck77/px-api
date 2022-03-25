
import { ISourceData, ISalesItem, IStore, IProduct } from '../interface/IStore';
import { getSalesItemJSON, getStoreProductJSON, getPreReport } from '../utils/fileUtils';

const START_DATE = 20220314;

export const buildReport = (sourceDatas: Array<ISourceData>, date: number, month: number) => {
    let stores = getStoreProductJSON(month) as Array<IStore>;

    let report = stores.map((store) => {

        let tempStore: IStore = { ...store };

        const sourceProducts = sourceDatas.filter(x => x.門市代號 == store.id);

        let products = store.products.map((product) => {

            let tempProduct: IProduct = { ...product }

            sourceProducts.forEach(product => {
                if (product.貨號 == tempProduct.id) {
                    tempProduct.sales = product.銷售量;
                    tempProduct.amount = product.銷售金額;
                    tempProduct.defective = product.丟棄量;
                    tempProduct.restock = product.進貨量;
                    tempProduct.stock = 0;
                }
            });

            return tempProduct;

        });

        tempStore.products = products;

        return tempStore;
    });

    // count stock
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