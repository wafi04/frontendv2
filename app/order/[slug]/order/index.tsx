"use client"
import { HeaderNumber } from "@/components/custom/headerNumber";
import { PlaceholderContent } from "@/components/custom/placeholderContent";
import { useOrderStore } from "@/hooks/useOrderStore";
import { CategoryWithSubCategories } from "../page";
import { HeaderFilterProduct } from "@/components/custom/headerFilterProduct";
import { useGetServiceByCategoryAndSubCategory } from "@/app/dashboard/service/server";
import { useFilterProduct } from "@/hooks/usefilterProduct";
import { ScrollContext } from "@/components/layouts/scrollProductToMethod";
import { useRef } from "react";
import { ProductPage } from "@/app/order/[slug]/order/serviceSection";
import { MethodSection } from "./payment-method";
import WhatsAppInput from "./wa-input";
import { CartDetails } from "./cartDetails";
import { KodeVoucherInput } from "./voucherInput";

export function OrderStep({ data }: { data: CategoryWithSubCategories }) {
    const { setUserId, setZone, userId, zone } = useOrderStore();
    const { filter } = useFilterProduct()
    const { data: productData } = useGetServiceByCategoryAndSubCategory({
        categoryId: data.id,
        subCategoryId: filter ?? 0,
    })
    const methodSectionRef = useRef<HTMLDivElement>(null);

    // Scroll function
    const scrollToMethod = () => {
        if (methodSectionRef.current) {
            methodSectionRef.current.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    };

    return (
        <ScrollContext.Provider value={{ scrollToMethod }}>
            <div className="lg:col-span-2 px-2 space-y-6">
                <div className="flex flex-col w-full rounded-lg overflow-hidden border-2">
                    <HeaderNumber number={"1"} title={"Masukkan Detail Akun"} />
                    <PlaceholderContent
                        category={data}
                        onChangeServerId={setZone}
                        serverId={zone}
                        userId={userId}
                        onChangeUserId={setUserId}
                    />
                </div>
                <div className="flex flex-col w-full rounded-lg overflow-hidden border-2">
                    <HeaderNumber number={"2"} title={"Pilih Product"} />
                    <HeaderFilterProduct subCategories={data.subCategories} />
                    <ProductPage products={productData?.regularServices} role={productData?.role as string} placeholder={data.placeholder1} />
                </div>
                <div ref={methodSectionRef}>
                    <MethodSection />
                </div>
                <WhatsAppInput />
                <KodeVoucherInput />
                <CartDetails />
            </div>
        </ScrollContext.Provider>
    )
}