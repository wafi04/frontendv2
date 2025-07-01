"use client"
import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Gamepad2 } from "lucide-react"
import { useGetAllNews } from "@/app/dashboard/news/server"

export function BannerHomePage() {
    // Replace with your actual hook
    const { data, isLoading, error } = useGetAllNews({
        search: "banner",
        status: "active",
    })

    const [currentIndex, setCurrentIndex] = useState(0)
    const [isAutoPlaying, setIsAutoPlaying] = useState(true)

    const banners = data?.data || []

    // Auto-play functionality
    useEffect(() => {
        if (!isAutoPlaying || banners.length <= 1) return

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex === banners.length - 1 ? 0 : prevIndex + 1))
        }, 5000)

        return () => clearInterval(interval)
    }, [banners.length, isAutoPlaying])

    const goToSlide = (index: number) => {
        setCurrentIndex(index)
    }

    const goToPrevious = () => {
        setCurrentIndex(currentIndex === 0 ? banners.length - 1 : currentIndex - 1)
    }

    const goToNext = () => {
        setCurrentIndex(currentIndex === banners.length - 1 ? 0 : currentIndex + 1)
    }

    if (isLoading) {
        return (
            <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] animate-pulse rounded-2xl">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>
        )
    }

    if (error || !banners.length) {
        return (
            <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-2xl flex items-center justify-center">
                <div className="text-center text-white">
                    <Gamepad2 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-xl font-semibold mb-2">No Banners Available</p>
                    <p className="text-gray-400">Check back later for updates</p>
                </div>
            </div>
        )
    }

    const currentBanner = banners[currentIndex]

    return (
        <div
            className="relative w-full h-[300px] md:h-[350px] overflow-hidden rounded-[0.625rem] group"
            style={{ backgroundColor: "oklch(0.14 0.05 264)" }}
        >
            {/* Main Banner Image */}
            <div className="relative w-full h-full">
                <img
                    src={currentBanner.path}
                    alt={currentBanner.description}
                    className="w-full h-full object-contain transition-transform duration-700 rounded-3xl"
                />

                {/* Gradient Overlay */}
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            "linear-gradient(to right, oklch(0.14 0.05 264 / 0.8), oklch(0.14 0.05 264 / 0.4), transparent)",
                    }}
                ></div>
                <div
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(to top, oklch(0.14 0.05 264 / 0.7), transparent, transparent)" }}
                ></div>
            </div>

            {/* Navigation Arrows */}
            {banners.length > 1 && (
                <>
                    <button
                        onClick={goToPrevious}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2.5 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 backdrop-blur-sm hover:backdrop-blur-md"
                        style={{ backgroundColor: "oklch(0.14 0.05 264 / 0.8)", color: "oklch(0.98 0.01 250)" }}
                        onMouseEnter={() => setIsAutoPlaying(false)}
                        onMouseLeave={() => setIsAutoPlaying(true)}
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={goToNext}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2.5 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 backdrop-blur-sm hover:backdrop-blur-md"
                        style={{ backgroundColor: "oklch(0.14 0.05 264 / 0.8)", color: "oklch(0.98 0.01 250)" }}
                        onMouseEnter={() => setIsAutoPlaying(false)}
                        onMouseLeave={() => setIsAutoPlaying(true)}
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </>
            )}

            {/* Dots Indicator */}
            {banners.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {banners.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === currentIndex ? "scale-125" : "hover:scale-110"
                                }`}
                            style={{
                                backgroundColor: index === currentIndex ? "oklch(0.98 0.01 250)" : "oklch(0.98 0.01 250 / 0.5)",
                            }}
                            onMouseEnter={() => setIsAutoPlaying(false)}
                            onMouseLeave={() => setIsAutoPlaying(true)}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
