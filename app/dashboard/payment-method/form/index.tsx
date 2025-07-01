import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MethodSchemas } from "@/validation/method";
import { useForm } from "react-hook-form";
import { useCreatePaymentMethod, useUpdatePaymentMethod } from "../server";
import { PaymentMethodData } from "@/types/paymentMethod";

interface FormPaymentMethodProps {
    initialData?: PaymentMethodData;
    onSuccess?: () => void;
}

export function FormPaymentMethod({
    initialData,
    onSuccess
}: FormPaymentMethodProps) {
    const isEdit = !!initialData?.id;

    const { mutate: createPaymentMethod, isPending: isCreating } = useCreatePaymentMethod();
    const { mutate: updatePaymentMethod, isPending: isUpdating } = useUpdatePaymentMethod();

    const form = useForm<MethodSchemas>({
        defaultValues: {
            code: initialData?.code || "",
            description: initialData?.description || "",
            image: initialData?.image || "",
            isActive: initialData?.isActive || "",
            maxAmount: initialData?.maxAmount?.toString() || "0",
            maxExpired: initialData?.maxExpired?.toString() || "0",
            minAmount: initialData?.minAmount?.toString() || "0",
            minExpired: initialData?.minExpired?.toString() || "0",
            name: initialData?.name || "",
            taxAdmin: initialData?.taxAdmin?.toString() || "0",
            taxType: initialData?.taxType || "PERCENTAGE",
            type: initialData?.type || "VA"
        }
    });

    const onSubmit = (data: MethodSchemas) => {
        const submitData = {
            ...data,
            maxAmount: data.maxAmount || "0",
            maxExpired: data.maxExpired || "0",
            minAmount: data.minAmount || "0",
            minExpired: data.minExpired || "0",
            taxAdmin: data.taxAdmin || "0",
        };

        if (isEdit) {
            updatePaymentMethod({
                data: submitData,
                id: initialData.id
            }, {
                onSuccess: () => {
                    onSuccess?.();
                }
            });
        } else {
            createPaymentMethod(submitData, {
                onSuccess: () => {
                    onSuccess?.();
                }
            });
        }
    };

    const isLoading = isCreating || isUpdating;

    return (

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Basic Information Section */}
                    <div className="space-y-4">
                        <h3 className="text-base font-semibold border-b pb-1">Basic Information</h3>

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name *</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Bank Transfer" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Code *</FormLabel>
                                    <FormControl>
                                        <Input placeholder="NQ" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Type *</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="VA">Virtual Account</SelectItem>
                                            <SelectItem value="EWALLET">E-Wallet</SelectItem>
                                            <SelectItem value="BANK">Bank Transfer</SelectItem>
                                            <SelectItem value="CREDIT_CARD">Credit Card</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="isActive"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status *</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="active">Aktif</SelectItem>
                                            <SelectItem value="inactive">Tidak Aktif</SelectItem>
                                            <SelectItem value="maintenance">Maintenance</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="image"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Image URL</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://example.com/image.png" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Amount & Expiry Configuration */}
                    <div className="space-y-4">
                        <h3 className="text-base font-semibold border-b pb-1">Amount & Expiry</h3>

                        <FormField
                            control={form.control}
                            name="minAmount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Min Amount</FormLabel>
                                    <FormControl>
                                        <Input type="text" placeholder="0" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="maxAmount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Max Amount</FormLabel>
                                    <FormControl>
                                        <Input type="text" placeholder="0" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="minExpired"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Min Expiry (min)</FormLabel>
                                    <FormControl>
                                        <Input type="text" placeholder="0" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="maxExpired"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Max Expiry (min)</FormLabel>
                                    <FormControl>
                                        <Input type="text" placeholder="0" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Tax Configuration & Description */}
                    <div className="space-y-4">
                        <h3 className="text-base font-semibold border-b pb-1">Tax & Description</h3>

                        <FormField
                            control={form.control}
                            name="taxAdmin"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tax Admin</FormLabel>
                                    <FormControl>
                                        <Input type="text" placeholder="0" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="taxType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tax Type</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select tax type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                                            <SelectItem value="FIXED">Fixed Amount</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Payment method description..."
                                            className="min-h-[120px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-4 border-t">
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="min-w-[120px]"
                    >
                        {isLoading ? "Saving..." : isEdit ? "Update" : "Create"}
                    </Button>
                </div>
            </form>
        </Form>

    );
}