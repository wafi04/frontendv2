"use client"
import { createContext, useContext } from "react";
export const ScrollContext = createContext<{
    scrollToMethod: () => void;
} | null>(null);

export const useScrollToMethod = () => {
    const context = useContext(ScrollContext);
    if (!context) {
        throw new Error("useScrollToMethod must be used within ScrollContext");
    }
    return context;
};
