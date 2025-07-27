import { Fragment, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown, ChevronUp } from "lucide-react";

// Utilities & Types
import { getTypeVariant } from "@/components/custom/badgeStatus"; // Assuming this handles transactionType variants
import { getStatusVariant } from "@/utils/statusHelper"; // Assuming this handles transaction status variants
import { formatDate, FormatPrice, truncateText } from "@/utils/format";
import { RecentTransactions } from "@/types/transactions"; // Your transaction type definition
import { ExpandedTransactionDetails } from "./expand";

// Sub-component for expanded row content

interface TableRecentTransactionsProps {
  transactions: RecentTransactions[];
}

export const TableRecentTransactions: React.FC<
  TableRecentTransactionsProps
> = ({ transactions }) => {
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  const toggleExpand = (orderId: string) => {
    setExpandedRowId((prev) => (prev === orderId ? null : orderId));
  };


  return (
    <div className="mt-10 rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">Order ID</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>User Info</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Total</TableHead>
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
                <TableRow className="hover:bg-muted/50">
                  <TableCell className="font-mono text-sm">
                    {/* Menggunakan div untuk flex agar truncateText bisa bekerja lebih baik */}
                    <div className="flex items-center">
                      <span
                        className="block truncate max-w-[100px] cursor-pointer" // Max width added for better truncation control
                        title={transaction.orderId}
                      >
                        {transaction.orderId}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="max-w-[200px] space-y-1">
                      <div className="text-sm font-medium leading-tight">
                        {truncateText(transaction.serviceName, 50)}
                      </div>
                      {transaction.nickname && (
                        <div className="text-xs text-muted-foreground">
                          {truncateText(transaction.nickname, 20)}
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground">
                        {transaction.userId}
                        {transaction.zone ? `-${transaction.zone}` : ""}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="max-w-[150px] space-y-1">
                      <div className="text-sm font-medium">
                        {transaction.username || "Anonymous"}
                      </div>{" "}
                      {/* Gunakan || untuk fallback */}
                      <div className="font-mono text-xs text-muted-foreground">
                        {transaction.paymentDetail.buyerNumber}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="max-w-[140px] space-y-1">
                      <span
                        className="block truncate text-sm"
                        title={transaction.paymentDetail.method}
                      >
                        {transaction.paymentDetail.method}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant={getTypeVariant(transaction.transactionType)}
                      className="text-xs"
                    >
                      {transaction.transactionType}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right font-medium">
                    {FormatPrice(transaction.paymentDetail.totalAmount)}
                  </TableCell>

                  <TableCell className="text-right font-medium">
                    <span
                      className={
                        transaction.profitAmount > 0
                          ? "text-green-600"
                          : transaction.profitAmount < 0
                          ? "text-red-600"
                          : ""
                      }
                    >
                      {FormatPrice(transaction.profitAmount)}
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
                      <div>{formatDate(transaction.createdAt)}</div>
                      {/* Hanya tampilkan updated_at jika berbeda dari created_at */}
                      {transaction.updatedAt &&
                        new Date(transaction.updatedAt).getTime() !==
                          new Date(transaction.createdAt).getTime() && (
                          <div className="text-xs text-muted-foreground">
                            {formatDate(transaction.updatedAt)}
                          </div>
                        )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleExpand(transaction.orderId)}
                      className="flex items-center gap-1"
                    >
                      {expandedRowId === transaction.orderId ? (
                        <>
                          <ChevronUp size={16} />
                          Collapse
                        </>
                      ) : (
                        <>
                          <ChevronDown size={16} />
                          Expand
                        </>
                      )}
                    </Button>
                  </TableCell>
                </TableRow>

                {/* Expanded Row for Details */}
                {expandedRowId === transaction.orderId && (
                  <TableRow>
                    <TableCell colSpan={10} className="p-0 border-none">
                      {/* Panggil komponen baru untuk detail yang diperluas */}
                      <ExpandedTransactionDetails transaction={transaction} />
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