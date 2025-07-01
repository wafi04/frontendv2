import { getTypeVariant } from "@/components/custom/badgeStatus";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { RecentTransactions } from "@/types/transactions";
import { formatDate, FormatPrice, truncateText } from "@/utils/format";
import { getStatusVariant } from "@/utils/statusHelper";
import { Fragment, useState } from "react";
import { Button } from "@/components/ui/button";

interface TableRecentTransactionsProps {
    transactions: RecentTransactions[];
}

export const TableRecentTransactions: React.FC<TableRecentTransactionsProps> = ({
    transactions
}) => {
    const [expandedRowId, setExpandedRowId] = useState<number | null>(null);

    const toggleExpand = (id: number) => {
        setExpandedRowId((prev) => (prev === id ? null : id));
    };

    return (
        <div className="rounded-md border mt-10">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[120px]">Order ID</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>User Info</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">Profit</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transactions.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={10} className="h-24 text-center">
                                No transactions found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        transactions.map((transaction) => (
                            <Fragment key={transaction.id}>
                                <TableRow >
                                    <TableCell className="font-mono text-sm">
                                        <div className="">
                                            <span
                                                className="block truncate"
                                                title={transaction.order_id}
                                            >
                                                {transaction.order_id}
                                            </span>
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <div className="space-y-1">
                                            <div className="font-medium text-sm leading-tight">
                                                {truncateText(transaction.service_name, 25)}
                                            </div>
                                            {transaction.nickname && (
                                                <div className="text-xs text-muted-foreground">
                                                    {transaction.nickname}
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <div className="space-y-1">
                                            <div className="font-medium text-sm">
                                                {transaction.username}
                                            </div>
                                            <div className="text-xs text-muted-foreground font-mono">
                                                {transaction.buyer_number}
                                            </div>
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <div className="max-w-[140px]">
                                            <span
                                                className="block text-sm truncate"
                                                title={transaction.payment_method}
                                            >
                                                {transaction.payment_method}
                                            </span>
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <Badge
                                            variant={getTypeVariant(transaction.transaction_type)}
                                            className="text-xs"
                                        >
                                            {transaction.transaction_type}
                                        </Badge>
                                    </TableCell>

                                    <TableCell className="text-right font-medium">
                                        {FormatPrice(transaction.total_amount)}
                                    </TableCell>

                                    <TableCell className="text-right font-medium">
                                        <span
                                            className={
                                                transaction.profit_amount > 0
                                                    ? "text-green-600"
                                                    : transaction.profit_amount < 0
                                                        ? "text-red-600"
                                                        : ""
                                            }
                                        >
                                            {FormatPrice(transaction.profit_amount)}
                                        </span>
                                    </TableCell>

                                    <TableCell>
                                        <Badge
                                            variant={getStatusVariant(transaction.status)}
                                            className="text-xs"
                                        >
                                            {transaction.status}
                                        </Badge>
                                    </TableCell>

                                    <TableCell className="text-sm text-muted-foreground">
                                        <div className="min-w-[120px]">
                                            {formatDate(transaction.created_at)}
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => toggleExpand(transaction.id)}
                                        >
                                            {expandedRowId === transaction.id ? "Collapse" : "Expand"}
                                        </Button>
                                    </TableCell>
                                </TableRow>

                                {expandedRowId === transaction.id && (
                                    <TableRow className="bg-muted/30 text-sm">
                                        <TableCell colSpan={10}>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-2 px-1">
                                                <div>
                                                    <span className="font-semibold">No Tujuan:</span>
                                                    {transaction.user_id}-{transaction.zone && transaction.zone}
                                                </div>
                                                <div>
                                                    <span className="font-semibold">Payment Number:</span>{" "}
                                                    {truncateText(transaction.payment_number, 20)}
                                                </div>
                                                <div>
                                                    <span className="font-semibold">Is Digi:</span>{" "}
                                                    {transaction.is_digi}
                                                </div>
                                                <div>
                                                    <span className="font-semibold">Fee:</span>{" "}
                                                    {FormatPrice(transaction.fee ?? 0)}
                                                </div>
                                                <div>
                                                    <span className="font-semibold">Discount:</span>{" "}
                                                    {FormatPrice(transaction.discount ?? 0)}
                                                </div>
                                                <div>
                                                    <span className="font-semibold">Harga Beli:</span>{" "}
                                                    {FormatPrice(transaction.purchase_price ?? 0)}
                                                </div>
                                                <div className="col-span-full">
                                                    <span className="font-semibold">Log:</span>{" "}
                                                    <pre className="whitespace-pre-wrap break-words text-xs mt-1 bg-muted p-2 rounded">
                                                        {transaction.log}
                                                    </pre>
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </Fragment>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default TableRecentTransactions;
