"use client";

import { CategoryData } from "@/types/category";
import { useEffect, useState } from "react";

interface SidebarOrderProps {
    category: CategoryData;
}

export function SidebarOrder({ category }: SidebarOrderProps) {
    const [steps, setSteps] = useState<string[]>([]);

    useEffect(() => {
        if (!category.information) {
            setSteps([]);
            return;
        }

        let content = category.information
            .replace(/<br\s*\/?>/gi, "\n")
            .replace(/<p>(.*?)<\/p>/gi, "$1\n")
            .replace(/<[^>]*>/g, "")
            .trim();

        const stepArray = content
            .split("\n")
            .filter((step) => step.trim().length > 0)
            .map((step) => step.trim());

        setSteps(stepArray);
    }, [category.information]);

    return (
        <div className="space-y-6">
            <div className="bg-blue-900/20 rounded-xl p-6 border border-blue-800/50">
                <h3 className="text-lg font-semibold text-white mb-4">
                    Cara Order
                </h3>

                {steps.length > 0 ? (
                    <div className="space-y-4">
                        {steps.map((step, index) => (
                            <div key={index} className="flex gap-4 text-sm group">
                                <div className="flex-shrink-0">
                                    <div className="w-7 h-7 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg">
                                        {index + 1}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-200">
                                        {step}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <div className="text-4xl mb-2">📋</div>
                        <p className="text-gray-400 text-sm">
                            No instructions available
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}