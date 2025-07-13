"use client";
import { FormatPrice } from "@/utils/format";
import Image from "next/image";
import { useState } from "react";
import { AlertTriangle, Calculator, TrendingUp } from "lucide-react";
import { PaymentMethod } from "@/types/paymentMethod";
import { useGetPaymentMethods } from "@/app/dashboard/payment-method/server";
import { useOrderStore } from "@/hooks/useOrderStore";
import { HeaderNumber } from "@/components/custom/headerNumber";
import { PaymentUsingSaldo } from "./paymentSaldo";

// Utility function untuk menghitung tax
function calculateTax(
    price: number,
    method: PaymentMethod
): { taxAmount: number; finalPrice: number } {
    if (!method.taxAdmin) {
        return { taxAmount: 0, finalPrice: price };
    }

    let taxAmount = 0;

    if (method.taxType === "PERCENTAGE") {
        taxAmount = Math.max((price * method.taxAdmin) / 100);
    } else {
        taxAmount = method.taxAdmin;
    }

    return {
        taxAmount,
        finalPrice: price + taxAmount, // Fixed: should add tax to price
    };
}

// Component untuk menampilkan price preview
function PricePreview({
    originalPrice,
    method,
    isSelected,
}: {
    originalPrice: number;
    method: PaymentMethod;
    isSelected: boolean;
}) {
    const { taxAmount, finalPrice } = calculateTax(originalPrice, method);
    const hasTax = taxAmount > 0;

    if (!hasTax) return null;

    return (
        <div
            className={`mt-2 p-2 rounded-md border transition-all duration-200 ${isSelected
                ? "bg-primary/10 border-primary/30"
                : "bg-muted/50 border-border/50"
                }`}
        >
            <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Harga dasar:</span>
                <span>{FormatPrice(originalPrice)}</span>
            </div>
            {/* <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Biaya admin:</span>
                <span>{FormatPrice(taxAmount)}</span>
            </div>
            <div className="flex justify-between items-center text-sm font-medium border-t pt-1 mt-1">
                <span>Total:</span>
                <span className="text-primary">{FormatPrice(finalPrice)}</span>
            </div> */}
        </div>
    );
}

export function MethodSection() {
    const { data, isLoading, error } = useGetPaymentMethods({
        status: "active"
    })

    const methodData = data ?? [];
    const {
        setMethod,
        method: metode,
        price,
        setFinalPrice,
        productDetails,
    } = useOrderStore();

    // Check if product is selected and price is valid
    const isProductSelected = price > 0 && productDetails.code;
    const shouldShowAlert = !isProductSelected;

    // Group methods by type
    const groupedMethods = methodData.reduce((acc, method: PaymentMethod) => {
        const type = method.type as string;
        if (!acc[type]) {
            acc[type] = [];
        }
        acc[type].push(method);
        return acc;
    }, {} as Record<string, PaymentMethod[]>);

    // State to track which sections are expanded
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

    const toggleSection = (section: string) => {
        if (shouldShowAlert) {
            return; // Don't allow expanding if no product selected
        }
        setExpandedSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const handleMethodSelect = (method: PaymentMethod) => {
        if (shouldShowAlert) {
            return; // Don't allow selection if no product selected
        }

        if (method.minAmount && method.minAmount > price) {
            return;
        }

        const { finalPrice, taxAmount } = calculateTax(price, method);
        setMethod({
            code: method.code,
            name: method.name,
        });
        setFinalPrice(finalPrice);
    };

    const handleSaldoSubmit = () => {
        setFinalPrice(price);
        setMethod({
            code: "SALDO",
            name: "Saldo Akun"
        });
    };

    if (isLoading)
        return (
            <div className="text-center py-4 text-foreground">
                Loading payment methods...
            </div>
        );
    if (error)
        return (
            <div className="text-center py-4 text-destructive">
                Error loading payment methods
            </div>
        );

    return (
        <div className="bg-card rounded-lg overflow-hidden shadow-lg border border-border">
            <HeaderNumber number={"3"} title="Metode Pembayaran" />

            <PaymentUsingSaldo onSubmit={handleSaldoSubmit} />

            <div className="space-y-3 p-3">
                {Object.keys(groupedMethods).map((type, index) => (
                    <div
                        key={index}
                        className={`bg-card border border-border rounded-lg overflow-hidden shadow-md transition-opacity ${shouldShowAlert ? "opacity-60" : "opacity-100"
                            }`}
                    >
                        <div
                            className={`${shouldShowAlert ? "cursor-not-allowed" : "cursor-pointer"
                                }`}
                            onClick={() => toggleSection(type)}
                        >
                            <div
                                className={`flex justify-between p-4 w-full items-center mb-3 transition-colors ${shouldShowAlert ? "bg-gray-400/50" : "bg-primary"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span
                                        className={`capitalize font-medium ${shouldShowAlert
                                            ? "text-gray-600"
                                            : "text-primary-foreground"
                                            }`}
                                    >
                                        {type}
                                    </span>
                                    {isProductSelected && (
                                        <div className="flex items-center gap-2 bg-blue-900 px-2 py-1 rounded-full">
                                            <span className="text-xs font-medium">
                                                {FormatPrice(price)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <span
                                    className={`text-sm transition-transform duration-300 ${shouldShowAlert ? "text-gray-500" : "text-blue-200"
                                        }`}
                                    style={{
                                        transform: expandedSections[type]
                                            ? "rotate(180deg)"
                                            : "rotate(0deg)",
                                    }}
                                >
                                    ▼
                                </span>
                            </div>

                            <div
                                className={`${expandedSections[type]
                                    ? "hidden "
                                    : "flex"
                                    } w-full flex-wrap gap-4 p-4 justify-end`}
                            >
                                {groupedMethods[type].map(
                                    (method, idx) =>
                                        method.image && (
                                            <Image
                                                key={idx}
                                                src={method.image}
                                                alt={method.name}
                                                width={50}
                                                height={40}
                                                className="object-cover"
                                            />
                                        )
                                )}
                            </div>
                        </div>
                        <div
                            className={`bg-popover overflow-hidden transition-all duration-300 ease-in-out ${expandedSections[type]
                                ? "max-h-screen opacity-100"
                                : "max-h-0 opacity-0"
                                }`}
                        >
                            <div className="p-3">
                                <div className="grid grid-cols-1 sm:grid-cols-2 w-full gap-3">
                                    {groupedMethods[type].map((method, idx) => {
                                        const isSelected = metode.code === method.code;
                                        const isMethodDisabled =
                                            shouldShowAlert || (method.minAmount && method.minAmount > price);
                                        const isPriceBelowMinimum =
                                            method.minAmount && method.minAmount > price && !shouldShowAlert;

                                        return (
                                            <div
                                                key={idx}
                                                onClick={() => handleMethodSelect(method)}
                                                className={`p-3 relative w-full rounded-lg flex flex-col transition-all duration-200 border shadow-sm
                                                ${isMethodDisabled
                                                        ? "cursor-not-allowed bg-gray-100 border-gray-200 opacity-50"
                                                        : isSelected
                                                            ? "border-primary bg-muted cursor-pointer"
                                                            : "border-border bg-card hover:bg-muted cursor-pointer hover:shadow-md"
                                                    }`}
                                            >
                                                <div className="flex flex-row items-center">
                                                    <div className="flex-shrink-0 mr-3">
                                                        <Image
                                                            src={method.image}
                                                            alt={method.name}
                                                            className={`object-cover rounded transition-opacity ${isMethodDisabled ? "opacity-50" : "opacity-100"
                                                                }`}
                                                            width={40}
                                                            height={40}
                                                        />
                                                    </div>

                                                    {isSelected && !isMethodDisabled && (
                                                        <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs rounded-full py-0.5 px-1.5">
                                                            ✓
                                                        </div>
                                                    )}

                                                    {isPriceBelowMinimum && (
                                                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs rounded-full py-0.5 px-1.5 flex items-center gap-1">
                                                            <AlertTriangle className="h-3 w-3" />
                                                            <span>Min</span>
                                                        </div>
                                                    )}

                                                    <div className="flex flex-col items-start min-w-0 flex-grow">
                                                        <span
                                                            className={`text-sm sm:text-md font-medium truncate w-full ${isMethodDisabled
                                                                ? "text-gray-400"
                                                                : "text-card-foreground"
                                                                }`}
                                                        >
                                                            {method.name}
                                                        </span>
                                                        <span
                                                            className={`text-xs sm:text-sm font-medium truncate w-full ${isMethodDisabled
                                                                ? "text-gray-300"
                                                                : "text-blue-400"
                                                                }`}
                                                        >
                                                            {method.description}
                                                        </span>
                                                    </div>
                                                </div>

                                                {!isMethodDisabled && isProductSelected && (
                                                    <PricePreview
                                                        originalPrice={price}
                                                        method={method}
                                                        isSelected={isSelected}
                                                    />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}