import { WhatsAppInput } from "@/components/custom/whatsappInput";
import { useAuth } from "@/hooks/useAuth";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { toast } from "sonner";

interface FormData {
    name: string;
    whatsapp: string;
}

export function EditProfileContent() {
    const { data} = useAuth();
    
    const { 
        register, 
        handleSubmit, 
        setValue, 
        watch, 
        formState: { errors, isSubmitting },
        reset 
    } = useForm<FormData>({
        defaultValues: {
            name: "",
            whatsapp: ""
        }
    });

    useEffect(() => {
        if (data?.data) {
            setValue("name", data.data.name ?? "");
            setValue("whatsapp", data.data.whatsapp ?? ""); 
        }
    }, [data, setValue]);

    const onSubmit = async (formData: FormData) => {
        try {
            // Handle form submission here
            console.log("Form data:", formData);
            
            // Add your API call here
            // await updateProfile(formData);
            
            // Show success message
            toast.success("Profile updated successfully!");
        } catch (error) {
            toast.error("Error updating profile. Please try again.");
        }
    };

    
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold mb-2">Edit Profile</h2>
                <p className="">Manage your account information and preferences</p>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="rounded-lg shadow-sm border p-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name
                            </label>
                            <input
                                type="text"
                                {...register("name", { 
                                    required: "Name is required",
                                    minLength: {
                                        value: 2,
                                        message: "Name must be at least 2 characters"
                                    }
                                })}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    errors.name ? "border-red-500" : "border-gray-300"
                                }`}
                                placeholder="Enter your full name"
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                            )}
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                WhatsApp Number
                            </label>
                            <WhatsAppInput 
                                value={watch("whatsapp")}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue("whatsapp", e.target.value)}
                                error={errors.whatsapp?.message}
                            />
                            {errors.whatsapp && (
                                <p className="text-red-500 text-sm mt-1">{errors.whatsapp.message}</p>
                            )}
                        </div>
                        
                        <div className="pt-4 flex gap-3">
                            <button 
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? "Saving..." : "Save Changes"}
                            </button>
                            
                            <button 
                                type="button"
                                onClick={() => reset()}
                                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}