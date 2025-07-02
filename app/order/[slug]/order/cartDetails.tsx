"use client";

import { useState, useEffect } from "react";
import { FormatPrice } from "@/utils/format";
import { useOrderStore } from "@/hooks/useOrderStore";
import { ActionButton, CartContainer, CartHeader, ExpandableContent, OrderDetails, PriceDetails, VoucherStatus } from "./details/details";
import { useOrderCreate } from "./server";



// Main Component
export function CartDetails() {
    const order = useOrderCreate()
    // State management
    const [isExpanded, setIsExpanded] = useState(false);
    const [hasScrolled, setHasScrolled] = useState(false);

    // Store and hooks
    const {
        method,
        price,
        voucherCode,
        zone,
        nickname,
        userId,
        finalPrice,
        productDetails,
        whatsAppNumber,
        tax,
        discount,
        resetOrder,
    } = useOrderStore();

    // Computed values
    const isProductSelected = Boolean(productDetails?.name);
    const isPaymentMethodSelected = Boolean(method?.name);
    const hasValidPrice = price > 0;
    const displayPrice = finalPrice;

    // Scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setHasScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);


    // Event handlers
    const handleToggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    const handleAction = () => {
        order.mutate({
            gameId: userId,
            methodCode: method.code,
            nickname: nickname as string,
            productCode: productDetails.code,
            whatsAppNumber,
            voucherCode: voucherCode,
            zone: zone
        })
        console.log("Action triggered");
    };

    // Helper functions
    const getHeaderTitle = () => {
        if (!isProductSelected) return "Mulai Order";
        if (!hasValidPrice) return `${productDetails.name} - Lihat Order`;
        return `${productDetails.name} - ${FormatPrice(displayPrice as number)}`;
    };

    return (
        <CartContainer hasScrolled={hasScrolled} isExpanded={isExpanded}>
            <CartHeader
                title={getHeaderTitle()}
                isExpanded={isExpanded}
                onToggle={handleToggleExpanded}
            />

            <ExpandableContent isExpanded={isExpanded}>
                <OrderDetails
                    userId={userId}
                    zone={zone as string}
                    nickname={nickname}
                    productName={productDetails?.name}
                    methodName={method?.name}
                    whatsAppNumber={whatsAppNumber}
                />

                <VoucherStatus voucherCode={voucherCode} />

                <PriceDetails
                    price={price}
                    tax={tax as number}
                    discount={discount}
                    finalPrice={finalPrice as number}
                />

                <ActionButton
                    isProductSelected={isProductSelected}
                    isPaymentMethodSelected={isPaymentMethodSelected}
                    hasValidPrice={hasValidPrice}
                    onAction={handleAction}
                />
            </ExpandableContent>
        </CartContainer>
    );
}