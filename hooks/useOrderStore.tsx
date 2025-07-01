import { PaymentMethod } from "@/types/paymentMethod";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ProductDetails = {
    code: string;
    name: string;
};
type PaymentMethodSubset = Pick<PaymentMethod, "code" | "name">;


export interface Items {
    userId: string;
    zone: string | undefined;
    method: PaymentMethodSubset;

    product: ProductDetails;
    whatsAppNumber: string;
    discount: number | undefined;
    price: number;
    finalPrice: number | undefined;
}

export type OrderState = {
    userId: string;
    tax: number | null;
    zone: string | undefined;
    productDetails: ProductDetails;
    voucherCode: string;
    whatsAppNumber: string;
    discount: number | undefined;
    finalPrice: number | undefined;
    method: Pick<PaymentMethodSubset, "code" | "name">;
    history: Items[];
    price: number;
};

export type OrderActions = {
    setUserId: (userId: string) => void;
    setFinalPrice: (fp: number | undefined) => void;
    setDiscount: (disc: number | undefined) => void;
    setZone: (zone: string) => void;
    setTax: (tax: number) => void;
    setProduct: (product: ProductDetails) => void;
    setMethod: (method: PaymentMethodSubset) => void;
    setVoucherCode: (voucherCode: string) => void;
    setPrice: (price: number) => void;
    setWhatsAppNumber: (wa: string) => void;
    setHistory: (item: Items | null) => void;
    applyHistoryToOrder: (item: Items) => void;
    resetHistory: () => void;
    resetOrder: () => void;
};

export type OrderStore = OrderState & OrderActions;

const initialState: OrderState = {
    userId: "",
    tax: null,
    discount: undefined,
    finalPrice: undefined,
    history: [],
    zone: undefined,
    whatsAppNumber: "",
    productDetails: {
        code: "",
        name: "",
    },
    method: {
        name: "",
        code: "",
    },
    voucherCode: "",
    price: 0,
};

export const useOrderStore = create<OrderStore>()(
    persist(
        (set, get) => ({
            ...initialState,
            setDiscount: (disc) => set({ discount: disc }),
            setFinalPrice: (fp) => set({ finalPrice: fp }),
            setWhatsAppNumber: (wa) => set({ whatsAppNumber: wa }),
            setUserId: (userId) => set({ userId }),
            setTax: (tax) => set({ tax }),
            setZone: (zone) => set({ zone }),
            setProduct: (productDetails) => set({ productDetails }),
            setMethod: (method) => set({ method }),
            setVoucherCode: (voucherCode) => set({ voucherCode }),
            setPrice: (price) => set({ price }),
            setHistory: (item) => {
                if (item === null) return;
                const currentState = get();

                const historyItem: Items = {
                    method: item.method,
                    product: item.product,
                    whatsAppNumber: item.whatsAppNumber,
                    discount: item.discount,
                    price: item.price,
                    finalPrice: item.finalPrice,
                    userId: currentState.userId,
                    zone: currentState.zone,
                };

                const currentHistory = currentState.history;
                const newHistory = [...currentHistory, historyItem].slice(-3);
                set({ history: newHistory });
            },

            applyHistoryToOrder: (item) => {
                console.log(item);
                set({
                    productDetails: item.product,
                    method: item.method,
                    whatsAppNumber: item.whatsAppNumber,
                    discount: item.discount,
                    price: item.price,
                    finalPrice: item.finalPrice,
                    userId: item.userId || "",
                    zone: item.zone || undefined,
                    voucherCode: "",
                });
            },
            resetHistory: () => set({ history: [] }),
            resetOrder: () =>
                set({
                    userId: "",
                    tax: null,
                    discount: undefined,
                    finalPrice: undefined,
                    zone: undefined,
                    whatsAppNumber: "",
                    productDetails: {
                        code: "",
                        name: "",
                    },
                    method: {
                        name: "",
                        code: "",
                    },
                    voucherCode: "",
                    price: 0,
                }),
        }),
        {
            name: "order-storage",
            partialize: (state) => ({
                history: state.history, // hanya simpan history
            }),
        }
    )
);