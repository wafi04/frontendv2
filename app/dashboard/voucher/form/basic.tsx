import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { CreateVoucherInput } from "@/types/voucher";
import { JSX } from "react";
import {
    FieldErrors,
    UseFormRegister,
    UseFormSetValue,
    UseFormWatch,
    UseWatchProps,
} from "react-hook-form";
import { z } from "zod";

export interface FormBasicVoucherProps {
    register: UseFormRegister<CreateVoucherInput>;
    errors: FieldErrors<CreateVoucherInput>;
    watch: UseFormWatch<CreateVoucherInput>;
    setValue: UseFormSetValue<CreateVoucherInput>;
}

export function FormBasicVoucher({
    register,
    watch,
    setValue,
    errors,
}: FormBasicVoucherProps): JSX.Element {
    return (
        <TabsContent value="basic" className="space-y-6">
            {/* Kode Voucher */}
            <div className="space-y-2">
                <Label htmlFor="code">Kode Voucher</Label>
                <Input id="code" placeholder="SUMMER2023" {...register("code")} />
                <p className="text-sm text-muted-foreground">Masukkan kode unik.</p>
                {errors.code && (
                    <p className="text-sm font-medium text-destructive">
                        {errors.code.message}
                    </p>
                )}
            </div>

            {/* Deskripsi */}
            <div className="space-y-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                    id="description"
                    placeholder="Masukkan deskripsi voucher (opsional)"
                    className="resize-none"
                    {...register("description")}
                />
                <p className="text-sm text-muted-foreground">
                    Berikan detail tambahan tentang voucher ini
                </p>
                {errors.description && (
                    <p className="text-sm font-medium text-destructive">
                        {errors.description.message}
                    </p>
                )}
            </div>

            {/* Status Aktif */}
            <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                    <Label className="text-base">Status Aktif</Label>
                    <p className="text-sm text-muted-foreground">
                        Aktifkan atau nonaktifkan voucher ini
                    </p>
                </div>
                <Select
                    onValueChange={(value) => setValue("isActive", value)}
                    defaultValue="inactive"
                >

                    <SelectTrigger>
                        <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>

                    <SelectContent>
                        <SelectItem value="active">Aktif</SelectItem>
                        <SelectItem value="inactive">Tidak Aktif</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </TabsContent>
    );
}