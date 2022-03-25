
import { ISourceData, ISalesItem, IStore, IProduct } from '../interface/IStore';
import { getCurrentSalesItem, getPreReport } from '../utils/fileUtils';

const START_DATE = 20220320;

export const getReport = (sourceDatas: Array<ISourceData>, date: number) => {
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

            if (productInfo.restock > 0) {
                productInfo.stock = productInfo.restock - productInfo.sales
            }

            storeInfo.products.push(productInfo);
        });

        return storeInfo
    });

    report = report.filter((x) => {
        return x.products.length > 0
    });

    // if (date !== 20220320) {
    //     const preReport = getPreReport(date) as Array<IStore>;

    //     report.forEach(store => {

    //         const preReportStore = preReport.find((x) => {
    //             return x.id = store.id
    //         });

    //         if (store.products.length > 0) {
    //             store.products.forEach((product) => {

    //                 if (preReportStore != null && preReportStore.products.length > 0) {
    //                     const preProduct = preReportStore.products.filter((x) => {
    //                         return x.id == product.id
    //                     });

    //                     // if (preProduct.sales > 0) {
    //                     //     product.stock = preProduct.stock - product.sales;
    //                     // }
    //                 }
    //             });
    //         }
    //     });
    // }

    return report;
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