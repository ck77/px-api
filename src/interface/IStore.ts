export interface IStore {
    id: string;
    name: string;
    products: Array<IProduct>
}

export interface IProduct {
    id: string;
    name: string;
    sales?: number;
    amount?: number;
    defective?: number;
    restock?: number;
    stock?: number;
}

export interface ISourceData {
    期間: string;
    門市代號: string;
    門市名稱: string;
    貨號: string;
    商品名稱: string;
    進貨量: number;
    銷售量: number;
    銷售金額: number;
    丟棄量: number;
    期末庫存: number
}

export interface ISalesItem {
    id: string;
    name: string;
}