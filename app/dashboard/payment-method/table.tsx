import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PaymentMethod } from "@/types/paymentMethod";
import { formatDate } from "@/utils/format";
import { useDeletePaymentMethod } from "./server";
import { useState } from "react";
import { DialogPaymentMethod } from "./dialog";

export function PaymentMethodsTable({ data }: { data: PaymentMethod[] }) {
    const { mutate, isPending } = useDeletePaymentMethod();

    const [open, setOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<PaymentMethod | null>(null);

    const handleDelete = (id: number) => {
        if (confirm("Are you sure you want to delete this payment method?")) {
            mutate(id);
        }
    };

    const handleEdit = (item: PaymentMethod) => {
        setSelectedItem(item);
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
        setSelectedItem(null);
    };

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>No</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Code</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Tax</TableHead>
                        <TableHead>Amount Range</TableHead>
                        <TableHead>Expired Range</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((item, index) => (
                        <TableRow key={item.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.code}</TableCell>
                            <TableCell>{item.type}</TableCell>
                            <TableCell>{item.isActive}</TableCell>
                            <TableCell>
                                {item.taxAdmin}% ({item.taxType})
                            </TableCell>
                            <TableCell>
                                {item.minAmount} - {item.maxAmount}
                            </TableCell>
                            <TableCell>
                                {item.minExpired} - {item.maxExpired}
                            </TableCell>
                            <TableCell>{formatDate(item.createdAt as string)}</TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleEdit(item)}>
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => handleDelete(item.id)}
                                            disabled={isPending}
                                            className="text-red-600"
                                        >
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {open && selectedItem && (
                <DialogPaymentMethod
                    onClose={handleCloseDialog}
                    open={open}
                    initialData={selectedItem}
                />
            )}
        </>
    );
}
