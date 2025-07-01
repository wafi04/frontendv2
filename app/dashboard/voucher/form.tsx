"use client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    Info,
    Percent,
    Tag,
    CalendarPlus2Icon as CalendarIcon2,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useVoucherForm } from "@/hooks/useVoucherForm";
import { FormBasicVoucher } from "./form/basic";
import { FormDiscountVoucher } from "./form/disc";
import { FormValidity } from "./form/validity";
import { VoucherData } from "@/types/voucher";
import { FormCategories } from "./form/categories";
import { useGetCategories } from "../category/server/category";
import { useCreateVoucher, useUpdateVoucher } from "./server";


interface VoucherFormProps {
    initialData?: VoucherData;
    onSuccess?: () => void;
}

export function VoucherForm({ initialData, onSuccess }: VoucherFormProps) {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        errors,
        discountType,
        isForAllCategories,
        handleDiscountTypeChange,
        validateAndPrepareSubmission,
    } = useVoucherForm(initialData);

    const { mutate, isPending, error: createError } = useCreateVoucher()
    const { mutate: updatePost, isPending: updatedPending, error: updateError } = useUpdateVoucher(initialData?.id ?? 0)


    function onSubmit(
        values: Parameters<typeof validateAndPrepareSubmission>[0]
    ) {
        if (initialData) {
            updatePost({
                data: {
                    ...initialData,
                    ...values,
                    discountType: values.discountType as "PERCENTAGE" | "FIXED",
                    isActive: values.isActive as "active" | "inactive",
                },
                id: initialData.id
            })
        }
        else {

            mutate({
                ...values,
                isActive: values.isActive as "active" | "inactive"
            })
        }
    }

    const { data, isLoading, error } = useGetCategories()



    return (
        <div className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)}>
                <Tabs defaultValue="basic" className="w-full">
                    <TabsList className="grid grid-cols-4 mb-6">
                        <TabsTrigger value="basic" className="flex items-center gap-2">
                            <Info className="h-4 w-4" />
                            <span>Basic Info</span>
                        </TabsTrigger>
                        <TabsTrigger value="discount" className="flex items-center gap-2">
                            <Percent className="h-4 w-4" />
                            <span>Discount</span>
                        </TabsTrigger>
                        <TabsTrigger value="validity" className="flex items-center gap-2">
                            <CalendarIcon2 className="h-4 w-4" />
                            <span>Validity</span>
                        </TabsTrigger>
                        <TabsTrigger value="categories" className="flex items-center gap-2">
                            <Tag className="h-4 w-4" />
                            <span>Categories</span>
                        </TabsTrigger>
                    </TabsList>

                    {/* Basic Info Tab */}
                    <FormBasicVoucher
                        errors={errors}
                        register={register}
                        setValue={setValue}
                        watch={watch}
                    />

                    {/* Discount Tab */}
                    <FormDiscountVoucher
                        errors={errors}
                        register={register}
                        setValue={setValue}
                        watch={watch}
                        discountType={discountType as "FIXED" | "PERCENTAGE"}
                        handleDiscount={handleDiscountTypeChange}
                    />

                    {/* Validity Tab */}
                    <FormValidity
                        errors={errors}
                        register={register}
                        setValue={setValue}
                        watch={watch}
                    />
                    <FormCategories
                        errors={errors}
                        register={register}
                        setValue={setValue}
                        watch={watch}
                        categories={data?.data ?? []}
                        isForAllCategories={isForAllCategories as string ?? "active"}
                    />
                </Tabs>

                {/* Aksi Form */}
                <div className="flex justify-end gap-2 mt-6">
                    <Button type="button" variant="outline" onClick={onSuccess}>
                        Batal
                    </Button>
                    <Button type="submit" disabled={isLoading || isPending || updatedPending} className="bg-blue-600 text-white hover:bg-blue-700">
                        {isLoading || isPending || updatedPending ? "Memproses..." : ""}
                        {initialData ? "Perbarui Voucher" : "Buat Voucher"}
                    </Button>
                </div>
            </form>
        </div>
    );
}