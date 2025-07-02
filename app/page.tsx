""
import { BannerHomePage } from "./pages/home/banner";
import { Navbar } from "@/components/custom/navbar";
import { CategoriesAll } from "./pages/home/categories";
import { PopularSection } from "./pages/home/popularCategories";
import { Footer } from "@/components/layouts/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-4 md:pt-10 max-w-7xl">
        <BannerHomePage />
        <PopularSection />
        <CategoriesAll />

      </main>
      <Footer />
    </>
  );
}
