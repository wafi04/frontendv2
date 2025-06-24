import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormValuesSubCategory } from "@/validation/category";
import { useForm } from "react-hook-form";
import { useCreateSubCategory } from "../server";

export default function FormSubCategory() {
    const {mutate}  = useCreateSubCategory()
    const form = useForm<FormValuesSubCategory>({
        defaultValues: {
            categoryId: undefined,
            code: "",
            isActive: "active",
            name: ""
        }
    });

    const onSubmit = (data: FormValuesSubCategory) => {
        console.log(data);
        mutate(data)
    };

    return (
       
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Category ID Field */}
                        <FormField
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium text-gray-700">
                                        Category ID *
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="Enter category ID"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            {...field}
                                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                                            value={field.value || ""}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-500 text-sm" />
                                </FormItem>
                            )}
                        />

                        {/* Name Field */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium text-gray-700">
                                        Sub Category Name *
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter sub category name"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-500 text-sm" />
                                </FormItem>
                            )}
                        />

                        {/* Code Field */}
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium text-gray-700">
                                        Code *
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter sub category code"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-500 text-sm" />
                                </FormItem>
                            )}
                        />

                        {/* Status Field */}
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

                        {/* Submit Buttons */}
                        <div className="flex gap-4 pt-4">
                            <Button 
                                type="submit" 
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
                            >
                                Save Sub Category
                            </Button>
                            <Button 
                                type="button" 
                                variant="outline"
                                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2 px-4 rounded-md transition-colors duration-200"
                                onClick={() => form.reset()}
                            >
                                Reset
                            </Button>
                        </div>
                    </form>
                </Form>
           
    );
}