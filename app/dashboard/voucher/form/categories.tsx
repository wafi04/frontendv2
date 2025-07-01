import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { FormBasicVoucherProps } from "./basic";

interface FormCategoriesProps extends FormBasicVoucherProps {
    isForAllCategories: string;
    categories: {
        id: number;
        name: string;
    }[];
}

export function FormCategories({
    categories,
    isForAllCategories,
    errors,
    setValue,
    watch,
}: FormCategoriesProps) {
    const selectedCategoryIds = watch("categoryIds") || [];

    const handleCategoryToggle = (categoryId: number) => {
        const currentIds = selectedCategoryIds;
        const isSelected = currentIds.includes(categoryId);

        if (isSelected) {
            // Remove category
            const newIds = currentIds.filter((id: number) => id !== categoryId);
            setValue("categoryIds", newIds);
        } else {
            // Add category
            setValue("categoryIds", [...currentIds, categoryId]);
        }
    };

    const handleRemoveCategory = (categoryId: number) => {
        const newIds = selectedCategoryIds.filter((id: number) => id !== categoryId);
        setValue("categoryIds", newIds);
    };

    const selectedCategories = categories.filter(cat =>
        selectedCategoryIds.includes(cat.id)
    );

    return (
        <TabsContent value="categories" className="space-y-6">
            {/* Kategori (hanya jika tidak berlaku untuk semua kategori) */}
            {categories && (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="categoryIds">Kategori</Label>
                        <p className="text-sm text-muted-foreground">
                            Pilih kategori yang berlaku untuk voucher ini
                        </p>
                    </div>

                    {/* Selected Categories as Badges */}
                    {selectedCategories.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {selectedCategories.map((category) => (
                                <Badge
                                    key={category.id}
                                    variant="secondary"
                                    className="flex items-center gap-1 px-2 py-1"
                                >
                                    {category.name}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveCategory(category.id)}
                                        className="ml-1 hover:bg-muted rounded-full p-0.5"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    )}

                    {/* Category Checkboxes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto border rounded-md p-4">
                        {categories.map((category) => (
                            <div key={category.id} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`category-${category.id}`}
                                    checked={selectedCategoryIds.includes(category.id)}
                                    onCheckedChange={() => handleCategoryToggle(category.id)}
                                />
                                <Label
                                    htmlFor={`category-${category.id}`}
                                    className="text-sm font-normal cursor-pointer"
                                >
                                    {category.name}
                                </Label>
                            </div>
                        ))}
                    </div>

                    {/* Error Message */}
                    {errors.categoryIds && (
                        <p className="text-sm font-medium text-destructive">
                            {errors.categoryIds.message}
                        </p>
                    )}

                    {/* Selected Count */}
                    <p className="text-xs text-muted-foreground">
                        {selectedCategories.length} dari {categories.length} kategori dipilih
                    </p>
                </div>
            )}
        </TabsContent>
    );
}