"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
    ChevronLeft,
    ChevronRight,
    CreditCard,
    DollarSign,
    Hash,
    Info,
    Percent,
    Tag,
    Timer,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { PaymentMethod } from "@/types/paymentMethod";
import { MethodSchemas } from "@/validation/paymentMethod";
import { useCreatePaymentMethod, useUpdatePaymentMethod } from "./server";

const PAYMENT_TYPES = ["virtual-account", "e-walet", "cs-store"] as const;

export function FormPaymentMethod({
    data,
    isLoading,
}: {
    data?: PaymentMethod;
    isLoading?: boolean;
}) {
    const [step, setStep] = useState(1);
    const { mutate, isPending, error } = useCreatePaymentMethod()
    const { mutate: updateMutate, isPending: updatedPending, error: updateError } = useUpdatePaymentMethod()
    const totalSteps = 4;

    const form = useForm<MethodSchemas>({
        defaultValues: {
            code: data?.code ?? "",
            description: data?.description ?? "",
            maxExpired: data?.maxExpired ?? undefined,
            image: data?.image ?? "",
            minExpired: data?.minExpired ?? undefined,
            minAmount: data?.minAmount ?? undefined,
            maxAmount: data?.maxAmount ?? undefined,
            isActive: data?.isActive ?? "active",
            type: data?.type ?? "",
            taxType: (data?.taxType) ?? undefined,
            name: data?.name ?? "",
            taxAdmin: data?.taxAdmin ?? undefined,
        },
        mode: "onChange",
    });

    function handleSubmit(datas: MethodSchemas) {
        if (data) {
            updateMutate({
                id: data.id,
                data: {
                    ...datas,
                    isActive: datas.isActive as "active" | "inactive",
                },
            });
        } else {
            mutate({
                ...datas,
                isActive: datas.isActive as "active" | "inactive",
            });
        }
    }

    const nextStep = async () => {
        let fieldsToValidate: (keyof MethodSchemas)[] = [];

        switch (step) {
            case 1:
                fieldsToValidate = ["code", "name"];
                break;
            case 2:
                fieldsToValidate = ["taxType", "taxAdmin"];
                break;
            case 3:
                fieldsToValidate = ["type", "minAmount", "maxAmount", "description"];
                break;
            case 4:
                fieldsToValidate = ["minExpired", "maxExpired"];
                break;
        }

        const result = await form.trigger(fieldsToValidate as any);

        if (result) {
            if (step < totalSteps) {
                setStep(step + 1);
            } else {
                form.handleSubmit(handleSubmit)();
            }
        }
    };

    const prevStep = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)}>
                    <div className="space-y-6">
                        {/* Step 1: Basic Information */}
                        {step === 1 && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium flex items-center gap-2">
                                    <Info className="h-5 w-5 text-muted-foreground" />
                                    Basic Information
                                </h3>

                                <FormField
                                    control={form.control}
                                    name="code"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-1">
                                                <Hash className="h-4 w-4" />
                                                Code
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter payment method code"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-1">
                                                <Tag className="h-4 w-4" />
                                                Name
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter payment method name"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="isActive"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium text-gray-700">
                                                Status
                                            </FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                                        <SelectValue placeholder="Select status" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="active">
                                                        <span className="flex items-center">
                                                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                                            Active
                                                        </span>
                                                    </SelectItem>
                                                    <SelectItem value="inactive">
                                                        <span className="flex items-center">
                                                            <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                                                            Inactive
                                                        </span>
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage className="text-red-500 text-sm" />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        )}

                        {/* Step 2: Tax Information */}
                        {step === 2 && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium flex items-center gap-2">
                                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                                    Tax Information
                                </h3>

                                <FormField
                                    control={form.control}
                                    name="taxType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-1">
                                                <Percent className="h-4 w-4" />
                                                Tax Type
                                            </FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select tax type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                                                    <SelectItem value="FLAT">Flat</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormDescription>
                                                Choose how tax will be calculated
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="taxAdmin"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-1">
                                                <DollarSign className="h-4 w-4" />
                                                Tax Admin
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="Enter tax admin value"
                                                    {...field}
                                                    onChange={(e) =>
                                                        field.onChange(Number(e.target.value) || undefined)
                                                    }
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                {form.watch("taxType") === "PERCENTAGE"
                                                    ? "Enter percentage value (e.g. 10 => 10%)"
                                                    : "Enter flat amount"}
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        )}

                        {/* Step 3: Payment Details */}
                        {step === 3 && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium flex items-center gap-2">
                                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                                    Payment Details
                                </h3>

                                <FormField
                                    control={form.control}
                                    name="type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Payment Type</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select payment type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {PAYMENT_TYPES.map((type) => (
                                                        <SelectItem key={type} value={type}>
                                                            {type
                                                                .replace("_", " ")
                                                                .replace(/\b\w/g, (l) => l.toUpperCase())}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormDescription>
                                                Choose the specific payment method type
                                            </FormDescription>
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
                                                <Input placeholder="Enter description" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="minAmount"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Minimum Amount</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="Enter minimum amount"
                                                        {...field}
                                                        onChange={(e) =>
                                                            field.onChange(
                                                                Number(e.target.value) || undefined
                                                            )
                                                        }
                                                    />
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
                                                <FormLabel>Maximum Amount</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="Enter maximum amount"
                                                        {...field}
                                                        onChange={(e) =>
                                                            field.onChange(
                                                                Number(e.target.value) || undefined
                                                            )
                                                        }
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 4: Expiration Settings */}
                        {step === 4 && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="minExpired"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-1">
                                                    <Timer className="h-4 w-4" />
                                                    Min Expiry (minutes)
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="Enter minimum expiry time"
                                                        {...field}
                                                        onChange={(e) =>
                                                            field.onChange(
                                                                Number(e.target.value) || undefined
                                                            )
                                                        }
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Minimum time before payment expires
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="maxExpired"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-1">
                                                    <Timer className="h-4 w-4" />
                                                    Max Expiry (minutes)
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="Enter maximum expiry time"
                                                        {...field}
                                                        onChange={(e) =>
                                                            field.onChange(
                                                                Number(e.target.value) || undefined
                                                            )
                                                        }
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Maximum time before payment expires
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between  pt-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={prevStep}
                            disabled={step === 1}
                        >
                            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                        </Button>

                        {step < totalSteps ? (
                            <Button type="button" onClick={nextStep}>
                                Next <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                        ) : (
                            <Button type="button" onClick={nextStep}>
                                Submit
                            </Button>
                        )}
                    </div>
                </form>
            </Form>
        </>
    );
}