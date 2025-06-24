import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Check, Upload, Image } from "lucide-react";
import { FormCategory, FormValuesCategory } from "@/validation/category";
import { stepsCategory } from "@/data/stepCategory";
import { useCreateCategory, useUpdateCategory } from "../server/category";
import { CategoryData } from "@/types/category";

export function FormCrudCategory({
  category 
}: {
  category?: CategoryData
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const { mutate, isPending, error } = useCreateCategory()
  const {mutate : updated, isPending : updateIsPending, error : errorUpdated}  = useUpdateCategory(category?.id ?? 0)

  const form = useForm<FormValuesCategory>({
    resolver: zodResolver(FormCategory),
    defaultValues: {
      name: category?.name ?? "",
      subName: category?.subName ??"",
      brand: category?.brand ??"",
      code: category?.code ?? "",
      status: category?.status ?? "",
      type: category?.type ?? "",
      instruction:category?.instruction ?? "",
      information: category?.information ?? "",
      isCheckNickname:category?.isCheckNickname ??  "inactive",
      placeholder1: category?.placeholder1 ??"",
      placeholder2: category?.placeholder2 ?? "",
      thumbnail: category?.thumbnail ?? "",
      banner: category?.banner ?? "",
    },
  });

  const { watch, trigger } = form;
  const watchedValues = watch();

  // Check if current step is valid
  const validateCurrentStep = async () => {
    const currentFields = stepsCategory[currentStep].fields;
    const isValid = await trigger(currentFields);
    return isValid;
  };

  // Handle next step
  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (isValid) {
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }
      setCurrentStep((prev) => Math.min(prev + 1, stepsCategory.length - 1));
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  // Handle form submission
  const onSubmit = async (data: FormValuesCategory) => {
    if (category) {
      updated(data)
    } else {
      mutate(data)
    }
  };

  return (
    <div className=" space-y-6">
      <Form {...form}>
        <div className="space-y-6">
          {/* Step 1: Basic Information */}
          {currentStep === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Kategori *</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan nama kategori" {...field} />
                    </FormControl>
                    <FormDescription>
                      Nama utama kategori produk
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sub Nama *</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan sub nama" {...field} />
                    </FormControl>
                    <FormDescription>
                      Sub kategori atau nama tambahan
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand *</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan nama brand" {...field} />
                    </FormControl>
                    <FormDescription>
                      Brand atau penyedia layanan
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kode (Opsional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan kode kategori" {...field} />
                    </FormControl>
                    <FormDescription>
                      Kode unik untuk kategori ini
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* Step 2: Configuration */}
          {currentStep === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
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
                    <FormDescription>
                      Status ketersediaan kategori
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipe *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih tipe" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="game">Game</SelectItem>
                        <SelectItem value="voucher">Voucher</SelectItem>
                        <SelectItem value="popular">popular</SelectItem>
                        <SelectItem value="paket">Paket Data</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Jenis kategori produk</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isCheckNickname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nickname *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Checknikname" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">active</SelectItem>
                        <SelectItem value="inactive">inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Check Nickname Group</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* Step 3: Media */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="thumbnail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thumbnail *</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Input
                          placeholder="URL thumbnail atau upload file"
                          {...field}
                        />
                        <Button type="button" variant="outline" size="icon">
                          <Upload className="h-4 w-4" />
                        </Button>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Gambar thumbnail untuk kategori (recommended: 400x400px)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="banner"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Banner Layanan *</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Input
                          placeholder="URL banner atau upload file"
                          {...field}
                        />
                        <Button type="button" variant="outline" size="icon">
                          <Image className="h-4 w-4" />
                        </Button>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Banner untuk halaman layanan (recommended: 1200x400px)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Preview thumbnails if URLs are provided */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {watchedValues.thumbnail && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Preview Thumbnail:
                    </label>
                    <div className="aspect-square w-32 rounded-lg border overflow-hidden">
                      <img
                        src={watchedValues.thumbnail}
                        alt="Thumbnail preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src =
                            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjEyIiBmaWxsPSIjOTk5IiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5JbWFnZSBFcnJvcjwvdGV4dD48L3N2Zz4=";
                        }}
                      />
                    </div>
                  </div>
                )}

                {watchedValues.banner && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Preview Banner:
                    </label>
                    <div className="aspect-[3/1] w-48 rounded-lg border overflow-hidden">
                      <img
                        src={watchedValues.banner}
                        alt="Banner preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src =
                            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjEyIiBmaWxsPSIjOTk5IiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5CYW5uZXIgRXJyb3I8L3RleHQ+PC9zdmc+";
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Additional Details */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="placeholder1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Placeholder 1 *</FormLabel>
                      <FormControl>
                        <Input placeholder="Contoh: User ID" {...field} />
                      </FormControl>
                      <FormDescription>
                        Placeholder untuk field input pertama
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="placeholder2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Placeholder 2 *</FormLabel>
                      <FormControl>
                        <Input placeholder="Contoh: Server ID" {...field} />
                      </FormControl>
                      <FormDescription>
                        Placeholder untuk field input kedua
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="instruction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instruksi (Opsional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Masukkan instruksi penggunaan layanan..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Panduan atau instruksi untuk pengguna
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="information"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Informasi Tambahan (Opsional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Informasi penting lainnya..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Informasi tambahan tentang kategori
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Sebelumnya
            </Button>

            {currentStep === stepsCategory.length - 1 ? (
              <Button
                type="button"
                disabled={isPending}
                onClick={form.handleSubmit(onSubmit)}
                className="flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                {isPending ? "Loading" : "Buat Kategori"}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2"
              >
                Selanjutnya
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </Form>
    </div>
  );
}
