import { useMemo } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateVoucherInput, VoucherData } from "@/types/voucher";

export function useVoucherForm(initialData?: VoucherData) {
    const defaultExpiryDate = useMemo(() => {
        const date = new Date();
        date.setMonth(date.getMonth() + 1);
        return date;
    }, []);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<CreateVoucherInput>({
        defaultValues: {
            code: initialData?.code ?? "",
            discountType: initialData?.discountType ?? "PERCENTAGE",
            discountValue: initialData?.discountValue ?? 0,
            maxDiscount: initialData?.maxDiscount ?? undefined,
            minPurchase: initialData?.minPurchase ?? undefined,
            usageLimit: initialData?.usageLimit ?? undefined,
            isForAllCategories: initialData?.isForAllCategories ?? "active",
            isActive: initialData?.isActive ?? "active",
            startDate: initialData?.startDate
                ? new Date(initialData.startDate.toString()).toISOString()
                : new Date().toISOString(),
            expiryDate: initialData?.expiryDate
                ? new Date(initialData.expiryDate).toISOString()
                : defaultExpiryDate.toISOString(),
            description: initialData?.description ?? "",
            categoryIds: [],
        },
    });

    const discountType = watch("discountType");
    const isForAllCategories = watch("isForAllCategories");

    const handleDiscountTypeChange = (checked: boolean) => {
        setValue("discountType", checked ? "PERCENTAGE" : "FIXED");
    };

    const validateAndPrepareSubmission = (
        values: CreateVoucherInput
    ) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const startDate = new Date(values.startDate);
        const expiryDate = new Date(values.expiryDate);

        if (startDate < today) {
            throw new Error("Start date tidak boleh hari kemarin");
        }

        if (expiryDate < startDate) {
            throw new Error("Hari berakhir harus lebih cepat dari hari mulai");
        }

        return {
            ...values,
            startDate: startDate.toISOString(),
            expiryDate: expiryDate.toISOString(),
        };
    };

    return {
        register,
        handleSubmit,
        watch,
        setValue,
        errors,
        discountType,
        isForAllCategories,
        handleDiscountTypeChange,
        validateAndPrepareSubmission,
    };
}