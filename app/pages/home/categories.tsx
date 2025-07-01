"use client";

import { useFilterCategoryHome } from "@/hooks/useFilterCategories";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { HeaderFilterGame } from "./headerFilter";
import { Loader2, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useGetCategoryPagination } from "@/app/dashboard/category/server/category";
import { CategoryData } from "@/types/category";

export function CategoriesAll() {
    const { filter } = useFilterCategoryHome();
    const [page, setPage] = useState(1);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);
    const [allCategories, setAllCategories] = useState<CategoryData[]>([]); // Store accumulated categories

    const { data: CategoryData, isLoading } = useGetCategoryPagination({
        limit: "12",
        page: page.toString(),
        status: "active",
        search: filter
    });

    // Reset when filter changes
    useEffect(() => {
        setPage(1);
        setAllCategories([]);
        setIsLoadingMore(false);
    }, [filter]);

    // Update categories when new data arrives
    useEffect(() => {
        if (CategoryData?.data.data) {
            if (page === 1) {
                // First page - replace all categories
                setAllCategories(CategoryData.data.data);
            } else {
                // Subsequent pages - append to existing categories
                setAllCategories(prev => [...prev, ...CategoryData.data.data]);
            }
            setIsLoadingMore(false);
        }
    }, [CategoryData, page]);

    const handleLoadMore = () => {
        if (!isLoadingMore && CategoryData?.data.meta) {
            const hasNextPage = page < CategoryData.data.meta.totalPages;
            if (hasNextPage) {
                setIsLoadingMore(true);
                setPage((prev) => prev + 1);
            }
        }
    };

    const getTitle = () => {
        switch (filter) {
            case "gamelainnya":
                return "Top Games";
            case "voucher":
                return "Popular Vouchers";
            case "pulsa":
                return "Mobile Credit";
            default:
                return "PLN Services";
        }
    };

    // Check if there are more pages to load
    const hasMorePages = CategoryData?.data.meta ?
        page < CategoryData.data.meta.totalPages : false;

    return (
        <section className="min-h-screen mt-16">
            <HeaderFilterGame />

            {/* Title */}
            <div className="px-4 mb-6">
                <motion.h2
                    className="text-xl font-bold text-white"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    key={filter}
                >
                    {getTitle()}
                </motion.h2>
                <motion.p
                    className="text-gray-400 text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                >
                    {CategoryData?.data.meta?.totalItems || 0} {filter.toLowerCase()} tersedia
                </motion.p>
            </div>

            {/* Loading State for Initial Load */}
            {isLoading && page === 1 && (
                <div className="flex justify-center items-center py-20">
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                        <p className="text-gray-400 text-sm">Loading categories...</p>
                    </div>
                </div>
            )}

            {/* Content */}
            {!isLoading && allCategories.length > 0 && (
                <div className="px-4 pb-10">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={filter}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2"
                        >
                            {allCategories.map((category, index) => (
                                <Link href={`/order/${category.code}`} key={`${category.id}-${index}`}>
                                    <motion.div
                                        className="cursor-pointer relative overflow-hidden rounded-2xl h-full aspect-square hover:shadow-lg hover:shadow-blue-900/10 hover:border hover:border-blue-900/20"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.3,
                                            delay: index * 0.05
                                        }}
                                        onMouseEnter={() => setHoveredCard(category.id.toString())}
                                        onMouseLeave={() => setHoveredCard(null)}
                                    >
                                        {/* Hover effect */}
                                        {hoveredCard === category.id.toString() && (
                                            <motion.div
                                                className="absolute inset-0 opacity-30 bg-gradient-to-br from-amber-500/30 to-purple-500/30 blur-md"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 0.3 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                            />
                                        )}

                                        {/* Image */}
                                        <div className="relative flex items-center justify-center w-full h-full">
                                            {category.thumbnail && (
                                                <motion.img
                                                    src={category.thumbnail}
                                                    alt={category.name}
                                                    className="object-cover rounded-xl"
                                                    initial={{ width: "80%", height: "80%" }}
                                                    animate={{
                                                        width:
                                                            hoveredCard === category.id.toString()
                                                                ? "100%"
                                                                : "80%",
                                                        height:
                                                            hoveredCard === category.id.toString()
                                                                ? "100%"
                                                                : "80%",
                                                        borderRadius:
                                                            hoveredCard === category.id.toString()
                                                                ? "0.5rem"
                                                                : "0.75rem",
                                                    }}
                                                    transition={{ duration: 0.3 }}
                                                />
                                            )}

                                            {/* Logo ring */}
                                            {hoveredCard === category.id.toString() && (
                                                <motion.div
                                                    className="absolute inset-0 rounded-full border border-amber-500/30"
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{
                                                        opacity: [0.2, 0.5, 0.2],
                                                        scale: [1, 1.2, 1],
                                                    }}
                                                    transition={{ duration: 1.5, repeat: Infinity }}
                                                />
                                            )}
                                        </div>

                                        {/* Title on hover */}
                                        <AnimatePresence>
                                            {hoveredCard === category.id.toString() && (
                                                <motion.div
                                                    className="absolute bottom-0 left-0 right-0 backdrop-blur-sm bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4"
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: 10 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <motion.h3 className="text-center text-sm font-medium text-white mb-1 line-clamp-1">
                                                        {category.name}
                                                    </motion.h3>
                                                    <motion.p className="text-center text-xs text-blue-300 line-clamp-1">
                                                        {category.brand || "Brand"}
                                                    </motion.p>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                </Link>
                            ))}
                        </motion.div>
                    </AnimatePresence>

                    {/* Load More Button - Improved */}
                    {hasMorePages && (
                        <div className="flex justify-center mt-8">
                            <motion.button
                                onClick={handleLoadMore}
                                disabled={isLoadingMore}
                                className={`
                                    group relative overflow-hidden px-8 py-4 rounded-full font-medium
                                    transition-all duration-300 min-w-[140px]
                                    ${isLoadingMore
                                        ? 'bg-gray-600 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 cursor-pointer'
                                    }
                                    text-white shadow-lg hover:shadow-xl
                                `}
                                whileHover={!isLoadingMore ? { scale: 1.05 } : {}}
                                whileTap={!isLoadingMore ? { scale: 0.98 } : {}}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {/* Background animation */}
                                {!isLoadingMore && (
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20"
                                        initial={{ x: '-100%' }}
                                        whileHover={{ x: '100%' }}
                                        transition={{ duration: 0.6 }}
                                    />
                                )}

                                <div className="relative z-10 flex items-center justify-center gap-2">
                                    <AnimatePresence mode="wait">
                                        {isLoadingMore ? (
                                            <motion.div
                                                key="loading"
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                className="flex items-center gap-2"
                                            >
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                <span>Loading...</span>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="load-more"
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                className="flex items-center gap-2"
                                            >
                                                <span>Load More</span>
                                                <motion.div
                                                    animate={{ y: [0, 2, 0] }}
                                                    transition={{ duration: 1.5, repeat: Infinity }}
                                                >
                                                    <ChevronDown className="h-4 w-4" />
                                                </motion.div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Progress indicator */}
                                {CategoryData?.data.meta && (
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-yellow-400 to-orange-400"
                                            initial={{ width: 0 }}
                                            animate={{
                                                width: `${(page / CategoryData.data.meta.totalPages) * 100}%`
                                            }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    </div>
                                )}
                            </motion.button>
                        </div>
                    )}


                </div>
            )}

            {/* Empty State */}
            {!isLoading && allCategories.length === 0 && (
                <motion.div
                    className="flex flex-col items-center justify-center py-20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-semibold text-white mb-2">No categories found</h3>
                    <p className="text-gray-400 text-center">
                        No {filter.toLowerCase()} categories are available at the moment.
                    </p>
                </motion.div>
            )}
        </section>
    );
}