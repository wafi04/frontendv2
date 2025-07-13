"use client"
import { useAuth } from "@/hooks/useAuth"
import { useOrderStore } from "@/hooks/useOrderStore";
import { FormatPrice } from "@/utils/format"
import { useEffect } from "react";

interface PaymentUsingSaldoProps {
    onSubmit: () => void
}

export function PaymentUsingSaldo({ onSubmit }: PaymentUsingSaldoProps) {
    const { data } = useAuth()
    const {
        setMethod,
        method: metode,
        price,
        setFinalPrice,
        productDetails,
    } = useOrderStore();

    if(!data?.data){
        return null
    }

    const balance = data?.data.balance as number ?? 0
    const hasInsufficientBalance = balance <= 0 || price > balance
    const isProductSelected = price > 0 && productDetails.code;
    const isSaldoSelected = metode.code === "SALDO";

    useEffect(() => {
        if (isSaldoSelected && hasInsufficientBalance && isProductSelected) {
            setMethod({
                code: "",
                name: ""
            });
            setFinalPrice(price); // Reset to original price
        }
    }, [isSaldoSelected, hasInsufficientBalance, isProductSelected, price, setMethod, setFinalPrice]);

    const handleSaldoPayment = () => {
        if (hasInsufficientBalance || !isProductSelected) {
            return;
        }
        
        // Set final price to original price for saldo payment (no additional fees)
        setFinalPrice(price);
        setMethod({
            code: "SALDO",
            name: "Saldo Akun"
        });
        onSubmit();
    };

    return ( 
        <div className="relative m-3">            
            <div 
                className={`
                    border-2 rounded-lg p-6 transition-all duration-200 bg-card
                    ${!isProductSelected 
                        ? 'opacity-60 cursor-not-allowed border-gray-300' 
                        : hasInsufficientBalance 
                            ? 'border-red-300 cursor-not-allowed opacity-75' 
                            : isSaldoSelected 
                                ? 'border-primary bg-primary/10 cursor-pointer' 
                                : 'border-gray-300 hover:border-primary/50 cursor-pointer hover:bg-muted'
                    }`}
                onClick={handleSaldoPayment}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="text-2xl">🪙</div>
                        <div>
                            <h3>Saldo</h3>
                            <p className={`text-sm ${!isProductSelected ? 'text-gray-400' : 'text-gray-600'}`}>
                                {!isProductSelected 
                                    ? 'Pilih produk terlebih dahulu'
                                    : hasInsufficientBalance 
                                        ? 'Saldo tidak mencukupi' 
                                        : 'Gunakan saldo untuk pembayaran'
                                }
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className={`text-lg font-bold ${
                            !isProductSelected 
                                ? 'text-gray-400'
                                : hasInsufficientBalance 
                                    ? 'text-red-500' 
                                    : 'text-green-600'
                        }`}>
                            {FormatPrice(balance)}
                        </div>
                        {isSaldoSelected && isProductSelected && !hasInsufficientBalance && (
                            <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs rounded-full py-0.5 px-1.5">
                                ✓
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Warning message when saldo was selected but now insufficient */}
                {hasInsufficientBalance && isProductSelected && (
                    <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-600">
                        {balance <= 0 
                            ? 'Saldo Anda kosong. Silakan top up terlebih dahulu.'
                            : `Saldo Anda (${FormatPrice(balance)}) tidak mencukupi untuk produk ini (${FormatPrice(price)})`
                        }
                    </div>
                )}
            </div>
        </div>
    )
}