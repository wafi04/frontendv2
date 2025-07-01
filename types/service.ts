export type ServiceOrderData = {
    currentPrice: number;
    expiredFlashSale: null | string; // Bisa null atau string tanggal jika diisi
    isFlashSale: "inactive" | "active"; // Asumsi hanya dua kemungkinan
    isSuggest: "inactive" | "active";   // Asumsi juga hanya dua kemungkinan
    note: string;
    originalPrice: number;
    price: number;
    priceFlashSale: number;
    priceInfo: {
        role: string;
        isFlashSale: boolean;
        flashSaleExpired: null | string;
    };
    pricePlatinum: number;
    priceReseller: number;
    priceSuggest: number;
    productLogo: string | null;
    providerId: string;
    serviceName: string;
    suggestInfo: any | null;
}
export type ServiceOrderResponse = {
    flashSaleServices: ServiceOrderData[] | []
    hasFlashSale: boolean
    regularServices: ServiceOrderData[] | []
    role: string
    totalServices: number
}
