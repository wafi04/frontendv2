import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormUpdateUser } from "./formUpdateUser";

interface DialogUpdateUserProps {
    initialData?: {
        balance: number;
        name: string
        username: string;
        role: string;
    };
    open: boolean;
    setOpen: (open: boolean) => void;
}

export function DialogUpdateUser({ initialData, open, setOpen }: DialogUpdateUserProps) {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {initialData ? "Update User" : "Create User"}
                    </DialogTitle>
                    <DialogDescription>
                        {initialData
                            ? "Update informasi pengguna yang sudah ada"
                            : "Tambahkan pengguna baru ke sistem"
                        }
                    </DialogDescription>
                </DialogHeader>
                <FormUpdateUser
                    initialData={initialData}
                />
            </DialogContent>
        </Dialog>
    );
}