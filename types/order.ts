export interface OrderDetailRowProps {
    label: string;
    value?: string;
    highlight?: boolean;
}

export interface CartHeaderProps {
    title: string;
    isExpanded: boolean;
    onToggle: () => void;
}

export interface OrderDetailsProps {
    userId: string;
    zone?: string;
    nickname?: string
    productName?: string;
    methodName?: string;
    whatsAppNumber?: string;
}

export interface PriceDetailsProps {
    price: number;
    tax?: number;
    discount?: number;
    finalPrice: number;
}