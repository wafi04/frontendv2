import { cn } from "@/lib/utils";
import { CartHeaderProps, OrderDetailRowProps, OrderDetailsProps, PriceDetailsProps } from "@/types/order";
import { FormatPrice } from "@/utils/format";
import { ChevronDown, ChevronUp, ShoppingCart } from "lucide-react";

// Sub-components
export const OrderDetailRow = ({ label, value, highlight = false }: OrderDetailRowProps) => (
    <div className="flex justify-between items-center">
        <span className="text-white/70">{label}:</span>
        <span className={cn(
            "font-medium",
            highlight ? "text-blue-400" : "text-white"
        )}>
            {value || "-"}
        </span>
    </div>
);

export const CartHeader = ({ title, isExpanded, onToggle }: CartHeaderProps) => (
    <div
        className="bg-white/5 hover:bg-white/10 backdrop-blur-sm text-white p-4 flex items-center justify-between cursor-pointer transition-colors duration-200"
        onClick={onToggle}
    >
        <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            <span className="font-medium">{title}</span>
        </div>
        {isExpanded ? (
            <ChevronDown className="w-5 h-5" />
        ) : (
            <ChevronUp className="w-5 h-5" />
        )}
    </div>
);

export const OrderDetails = ({
    userId,
    zone,
    productName,
    methodName,
    nickname,
    whatsAppNumber
}: OrderDetailsProps) => (
    <div className="rounded-lg bg-white/5 backdrop-blur-sm p-4 space-y-3 border border-white/10">
        <OrderDetailRow label="User ID" value={userId} />
        {zone && <OrderDetailRow label="Zone" value={zone} highlight />}
        {nickname && <OrderDetailRow label="Nickname" value={nickname} highlight />}

        <OrderDetailRow label="Produk" value={productName} />
        <OrderDetailRow label="Metode Pembayaran" value={methodName} highlight />
        <OrderDetailRow label="WhatsApp" value={whatsAppNumber} />
    </div>
);

export const VoucherStatus = ({ voucherCode }: { voucherCode?: string }) => {
    if (!voucherCode?.trim()) return null;

    return (
        <div className="rounded-lg bg-white/5 backdrop-blur-sm p-3 border border-white/10">
            <div className="flex justify-between items-center">
                <span className="text-white/70">Voucher:</span>
                <span className="text-green-400 font-medium">{voucherCode}</span>
            </div>
        </div>
    );
};

export const PriceDetails = ({ price, tax, discount, finalPrice }: PriceDetailsProps) => {
    if (price <= 0) return null;

    return (
        <div className="rounded-lg bg-white/5 backdrop-blur-sm p-4 space-y-2 border border-white/10">
            <div className="flex justify-between items-center">
                <span className="text-white/70">Subtotal:</span>
                <span className="text-white">{FormatPrice(price)}</span>
            </div>

            {tax && tax > 0 && (
                <div className="flex justify-between items-center">
                    <span className="text-white/70">Pajak:</span>
                    <span className="text-white">{FormatPrice(tax)}</span>
                </div>
            )}

            {discount && discount > 0 && (
                <div className="flex justify-between items-center">
                    <span className="text-white/70">Diskon:</span>
                    <span className="text-green-400">-{FormatPrice(discount)}</span>
                </div>
            )}

            <hr className="border-white/20" />

            <div className="flex justify-between items-center font-medium">
                <span className="text-white">Total:</span>
                <span className="text-blue-400 text-lg">{FormatPrice(finalPrice)}</span>
            </div>
        </div>
    );
};

export const ActionButton = ({
    isProductSelected,
    isPaymentMethodSelected,
    hasValidPrice,
    onAction
}: {
    isProductSelected: boolean;
    isPaymentMethodSelected: boolean;
    hasValidPrice: boolean;
    onAction: () => void;
}) => {
    const getButtonText = () => {
        if (!isProductSelected) return "Pilih Produk";
        if (!isPaymentMethodSelected) return "Pilih Metode Pembayaran";
        if (!hasValidPrice) return "Hitung Harga";
        return "Checkout";
    };

    const isDisabled = !isProductSelected || !isPaymentMethodSelected || !hasValidPrice;

    return (
        <button
            onClick={onAction}
            disabled={isDisabled}
            className={cn(
                "w-full py-3 px-4 rounded-lg font-medium transition-colors duration-200",
                isDisabled
                    ? "bg-white/10 text-white/50 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
            )}
        >
            {getButtonText()}
        </button>
    );
};

export const CartContainer = ({
    hasScrolled,
    isExpanded,
    children
}: {
    hasScrolled: boolean;
    isExpanded: boolean;
    children: React.ReactNode;
}) => (
    <div
        className={cn(
            "fixed bottom-6 right-6 md:right-1/2 md:translate-x-1/2 transition-all duration-300 z-50 max-w-full md:max-w-xl w-auto md:w-full",
            hasScrolled ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        )}
    >
        <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-xl shadow-lg shadow-black/20 overflow-hidden">
            {children}
        </div>
    </div>
);

export const ExpandableContent = ({
    isExpanded,
    children
}: {
    isExpanded: boolean;
    children: React.ReactNode;
}) => (
    <div
        className={cn(
            "overflow-hidden transition-all duration-300",
            isExpanded ? "max-h-[70vh] opacity-100" : "max-h-0 opacity-0"
        )}
    >
        <div className="p-4 space-y-4 text-sm overflow-y-auto">
            {children}
        </div>
    </div>
);