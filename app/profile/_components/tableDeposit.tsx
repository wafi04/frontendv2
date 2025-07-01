import {
    Table,
    TableHead,
    TableHeader,
    TableRow,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { API_RESPONSE } from "@/types/response";
import { DepositData } from "@/types/deposit";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/format";
import Link from "next/link";

export function TableDeposit() {
    const { data, isLoading, error } = useQuery({
        queryKey: ["deposit"],
        queryFn: async () => {
            const response = await api.get<API_RESPONSE<DepositData[]>>('/deposit/user')
            return response.data
        },
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes
    })

    if (isLoading) return <Loader2 className="size-10 animate-spin" />;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow className="dark:bg-gray-800">
                        <TableHead className="text-left text-sm font-semibold ">
                            Tanggal
                        </TableHead>
                        <TableHead className="text-left text-sm font-semibold ">
                            Metode
                        </TableHead>
                        <TableHead className="text-left text-sm font-semibold ">
                            Jumlah
                        </TableHead>
                        <TableHead className="text-left text-sm font-semibold ">
                            Status
                        </TableHead>
                        <TableHead className="text-left text-sm font-semibold ">
                            Link Pembayaran
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data?.data?.map((deposit) => (
                        <TableRow key={deposit.id}>
                            <TableCell>
                                {deposit.createdAt
                                    ? formatDate(deposit.createdAt)
                                    : "-"}
                            </TableCell>
                            <TableCell>{deposit.method}</TableCell>
                            <TableCell>
                                {deposit.amount.toLocaleString("id-ID", {
                                    style: "currency",
                                    currency: "IDR",
                                })}
                            </TableCell>
                            <TableCell>{deposit.status}</TableCell>
                            <TableCell className="cursor-pointer">
                                <Button>
                                    <Link href={`/invoice?invoice=${deposit.depositId}`}>
                                        Link Pemabayaran
                                    </Link>
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );
}
