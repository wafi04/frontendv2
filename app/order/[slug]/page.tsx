import { HeroSection } from "@/app/order/[slug]/order/HeroSection"
import { SidebarOrder } from "@/app/order/[slug]/order/sidebar"
import { HeaderNumber } from "@/components/custom/headerNumber"
import { Navbar } from "@/components/custom/navbar"
import { PlaceholderContent } from "@/components/custom/placeholderContent"
import { BACKEND_URL } from "@/constants"
import { CategoryData } from "@/types/category"
import axios from "axios"
import { OrderStep } from "./order"

export interface CategoryWithSubCategories extends CategoryData {
    subCategories: {
        categoryId: number
        code: string
        id: number
        isActive: string
        name: string
    }[]
}

export default async function Page({ params }: { params: { slug: string | undefined } }) {
    const request = await axios(`${BACKEND_URL}/category/code/${params.slug}`)
    const dataCategoryCode = request.data.data as CategoryWithSubCategories
    return (
        <>
            <Navbar />
            <main>
                <HeroSection category={dataCategoryCode} />
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 container mx-auto max-w-7xl">
                    <div className="hidden lg:block lg:sticky lg:top-6 lg:self-start">
                        <SidebarOrder category={dataCategoryCode} />
                        {/* <CardHistory /> */}
                    </div>

                    <OrderStep data={dataCategoryCode} />
                </section>
            </main>

        </>
    )
}