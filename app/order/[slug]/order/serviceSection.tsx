"use client";
import { Flame, TrendingDown } from "lucide-react";
import Image from "next/image";
import { FormatPrice } from "@/utils/format";
import { motion } from "framer-motion";
import { SvgProduct } from "../../../../utils/svg";
import { ServiceOrderData } from "@/types/service";
import { useScrollToMethod } from "@/components/layouts/scrollProductToMethod";
import { useOrderStore } from "@/hooks/useOrderStore";
import { toast } from "sonner";

export function ProductPage({
    products,
    role,
    placeholder
}: {
    role: string | null
    products: ServiceOrderData[] | undefined
    placeholder: string
}) {


    return (
        <div className="max-h-[80vh] custom-scrollbar overflow-y-auto bg-background text-foreground p-4">
            {/* Products Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
                {products && products.map((product) => (
                    <ProductCard
                        key={product.serviceName}
                        product={product}
                        userRole={role}
                        placeholder={placeholder}
                    />
                ))}
            </div>

            {products && products.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-lg text-gray-400">
                        No products found matching your criteria
                    </p>
                </div>
            )}
        </div>
    );
}

function ProductCard({
    product,
    userRole,
    placeholder
}: {
    product: ServiceOrderData;
    userRole: string | null;
    placeholder: string;
}) {
    const { setProduct, productDetails, setPrice, userId } = useOrderStore();
    const { scrollToMethod } = useScrollToMethod(); // Use the scroll function
    const isSelected = product.providerId === productDetails.code;

    // Calculate original price and discount
    const getOriginalPrice = () => {
        if (product.priceSuggest && product.priceSuggest > product.currentPrice) {
            return product.priceSuggest;
        }
        return product.price
    };

    const originalPrice = getOriginalPrice();
    const hasDiscount = originalPrice > product.currentPrice;
    const discountAmount = originalPrice - product.currentPrice;
    const discountPercentage = Math.round((discountAmount / originalPrice) * 100);

    // Check if user gets special pricing
    const hasSpecialPricing =
        userRole && (userRole === "platinum" || userRole === "reseller");
    const specialPricingLabel =
        userRole === "platinum"
            ? "platinum"
            : userRole === "reseller"
                ? "reseller"
                : "";

    const handleProductClick = () => {
        if (!userId) {
            toast.message(`Silahkan Masukan ${placeholder} Anda Terlebih Dahulu`);
            return;
        }
        setProduct({
            code: product.providerId,
            name: product.serviceName,
        });
        setPrice(product.currentPrice);

        setTimeout(() => {
            scrollToMethod();
        }, 100);
    };

    return (
        <motion.div
            onClick={handleProductClick}
            className="relative rounded-xl cursor-pointer overflow-hidden shadow-lg hover:shadow-xl transition-all bg-blue-900/20 border border-border flex flex-col justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
        >
            {/* Product Content */}
            <div className="px-2 py-5 flex-grow">
                <div className="flex items-center justify-between">
                    <div className="flex-shrink-0">
                        {product.productLogo ? (
                            <Image
                                width={50}
                                height={50}
                                src={product.productLogo}
                                alt={product.serviceName}
                                className="w-12 h-12 object-contain rounded-md"
                            />
                        ) : (
                            <Image
                                width={40}
                                height={40}
                                src="/diamond.png"
                                alt="Default Diamond"
                                className="object-cover"
                            />
                        )}
                    </div>

                    {isSelected && (
                        <div className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs rounded-full py-0.5 px-1.5 z-10">
                            ✓
                        </div>
                    )}

                    <div className="ml-3 flex-grow">
                        <div className="flex items-center">
                            <span className="text-sm font-normal text-white">
                                {product.serviceName}
                            </span>
                        </div>

                        {/* Price Section */}
                        <div className="mt-1 space-y-1">
                            {/* Current Price */}
                            <div className="flex items-center gap-2">
                                <p className="font-semibold text-foreground">
                                    {FormatPrice(product.currentPrice)}
                                </p>

                                {/* Special Pricing Badge */}
                                {hasSpecialPricing && (
                                    <span className="bg-amber-500/20 text-amber-400 text-xs px-1.5 py-0.5 rounded-full font-medium">
                                        {specialPricingLabel}
                                    </span>
                                )}
                            </div>

                            {/* Original Price (crossed out) & Discount */}
                            {hasDiscount && (
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground line-through">
                                        {FormatPrice(originalPrice)}
                                    </span>
                                    <div className="flex items-center gap-1 bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded-full">
                                        <TrendingDown size={10} />
                                        <span className="text-xs font-medium">
                                            Hemat {discountPercentage}%
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom area with svg */}
            <div className="bg-blue-300 px-4 flex justify-end items-center">
                <SvgProduct className="h-8 w-14" />
            </div>

            {/* Flash Sale Badge */}
            {product.isFlashSale === "active" && (
                <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full flex items-center gap-1 z-10">
                    <Flame size={12} />
                    <span className="text-xs font-bold">FLASH SALE</span>
                </div>
            )}

            {/* Suggest Badge */}
            {product.isSuggest === "active" && (
                <div className="absolute top-2 right-2 bg-yellow-500 text-yellow-900 px-2 py-1 rounded-full z-10">
                    <span className="text-xs font-bold">REKOMENDASI</span>
                </div>
            )}

            {/* Corner Ribbon for Big Discounts */}
            {hasDiscount && discountPercentage >= 20 && (
                <div className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg">
                    -{discountPercentage}%
                </div>
            )}
        </motion.div>
    );
}