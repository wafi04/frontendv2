export const URL_LOGO =
  "https://res.cloudinary.com/dstvymie8/image/upload/v1741104560/LOGO_VAZZ_STORE_2_dereyt.webp";
export const BACKEND_URL = "http://localhost:3002/api/v1";
export const LAYANAN_PER_PAGE = 100;
export const TAX_RATE = 0.007;
export const MINIMUM_CUSTOM_AMOUNT = 1;
export const CATEGORIES_QUERY_KEY = ["categories"] as const;
export const STEPS = { PRODUCT_SELECTION: 1, ORDER_DETAILS: 2 };
export const DEFAULT_CATEGORY = 23;
export const DEBOUNCE_DELAY = 500;

export const NOMINAL_OPTIONS = [
  { value: "50000", label: "Rp 50.000" },
  { value: "100000", label: "Rp 100.000" },
  { value: "200000", label: "Rp 200.000" },
  { value: "500000", label: "Rp 500.000" },
  { value: "1000000", label: "Rp 1.000.000" },
] as const;

export const PAYMENT_METHODS = [
  { value: "virtual-account", label: "Virtual Account", icon: "🏦" },
  { value: "e-wallet", label: "E-Wallet", icon: "💳" },
  { value: "qris", label: "QRIS", icon: "📱" },
] as const;

export type PaymentMethodCode = (typeof PAYMENT_METHODS)[number]["value"];

export type BankMethod = {
  code: string;
  name: string;
};