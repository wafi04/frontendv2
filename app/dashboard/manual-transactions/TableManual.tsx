import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PaginationMeta } from "@/types/category";
import { formatDate, FormatPrice, truncateText } from "@/utils/format";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Fragment, useState } from "react";
import { ManualTransactionsData } from "./server";
import { getStatusVariant } from "@/utils/statusHelper";


interface TableManualTransactionsProps {
  transactions: ManualTransactionsData[];
  meta?: PaginationMeta;
}

export function TableManualTransactions({
  transactions,
  meta,
}: TableManualTransactionsProps) {
  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedRowId((prev) => (prev === id ? null : id));
  };


  return (
    <div className="rounded-md border mt-8">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[140px]">Transaction ID</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Nomor Tujuan</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead className="text-right">Harga</TableHead>
            <TableHead className="text-right">Profit</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created By</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className="h-24 text-center">
                No manual transactions found.
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((transaction) => (
              <Fragment key={transaction.id}>
                <TableRow className="">
                  <TableCell className="font-mono text-sm">
                    <div className="">
                      <div
                        className="font-medium truncate cursor-pointer"
                        title={transaction.manual_transaction_id}
                      >
                        {transaction.manual_transaction_id}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {transaction.order_id}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="space-y-1 max-w-[200px]">
                      <div className="font-medium text-sm leading-tight">
                        {truncateText(transaction.product_name, 25)}
                      </div>
                      {transaction.nickname && (
                        <div className="text-xs text-muted-foreground">
                          {truncateText(transaction.nickname, 20)}
                        </div>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="space-y-1 max-w-[120px]">
                      <p className="font-medium text-sm font-mono">
                        {transaction.user_id}-{transaction?.zone}
                      </p>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="max-w-[120px]">
                      <div className="text-sm font-mono">
                        {transaction.whatsapp}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="text-right font-medium">
                    <div>{FormatPrice(transaction.price)}</div>
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

                  <TableCell>
                    <div className="text-sm max-w-[100px]">
                      {truncateText(transaction.created_by, 15)}
                    </div>
                  </TableCell>

                  <TableCell className="text-sm text-muted-foreground">
                    <div className="min-w-[120px]">
                      <div>{formatDate(transaction.created_at)}</div>
                      {transaction.updated_at !== transaction.created_at && (
                        <div className="text-xs text-muted-foreground">
                          Updated: {formatDate(transaction.updated_at)}
                        </div>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleExpand(transaction.id)}
                      className="flex items-center gap-1"
                    >
                      {expandedRowId === transaction.id ? (
                        <>
                          <ChevronUp size={16} />
                          Hide
                        </>
                      ) : (
                        <>
                          <ChevronDown size={16} />
                          Details
                        </>
                      )}
                    </Button>
                  </TableCell>
                </TableRow>

                {expandedRowId === transaction.id && (
                  <TableRow className="">
                    <TableCell colSpan={10} className="p-0">
                        <div className="mx-6 my-4 p-6 bg-card ">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></div>
                          <h4 className="font-semibold text-lg ">
                            Transaction Details
                          </h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                          <DetailCard
                            icon="🆔"
                            label="Manual ID"
                            value={transaction.manual_transaction_id}
                            color="blue"
                          />
                          <DetailCard
                            icon="🔗"
                            label="Order ID"
                            value={transaction.order_id}
                            color="gray"
                          />
                          <DetailCard
                            icon="💰"
                            label="Base Profit"
                            value={FormatPrice(transaction.profit)}
                            color="green"
                          />
                          <DetailCard
                            icon="🎯"
                            label="Zone"
                            value={transaction.zone || "N/A"}
                            color="purple"
                          />
                          <DetailCard
                            icon="📞"
                            label="WhatsApp"
                            value={transaction.whatsapp}
                            color="green"
                          />
                          <DetailCard
                            icon="👤"
                            label="Created By"
                            value={transaction.created_by}
                            color="orange"
                          />
                          {transaction.serial_number && (
                            <DetailCard
                              icon="🔢"
                              label="Serial Number"
                              value={transaction.serial_number}
                              color="blue"
                            />
                          )}
                          <DetailCard
                            icon="📋"
                            label="Transaction Status"
                            value={transaction.transaction_status}
                            color={transaction.transaction_status === "SUCCESS" ? "green" : "red"}
                          />
                        </div>

                        {transaction.reason && (
                          <div className="mt-6 p-4">
                            <div className="flex items-center gap-2 mb-3">
                              <span className="text-lg">📝</span>
                              <h5 className="font-semibold">
                                Reason
                              </h5>
                            </div>
                            <div className=" dark:bg-gray-900 rounded-md p-3 border border-gray-200 dark:border-gray-600">
                              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                {transaction.reason}
                              </p>
                            </div>
                          </div>
                        )}
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
}

function DetailCard({
  icon,
  label,
  value,
  color = "gray",
}: {
  icon: string;
  label: string;
  value: string;
  color?: "blue" | "green" | "red" | "orange" | "purple" | "gray";
}) {
  const colorClasses = {
    blue: "from-blue-500/10 to-blue-600/10 border-blue-200 dark:border-blue-800",
    green: "from-green-500/10 to-green-600/10 border-green-200 dark:border-green-800",
    red: "from-red-500/10 to-red-600/10 border-red-200 dark:border-red-800",
    orange: "from-orange-500/10 to-orange-600/10 border-orange-200 dark:border-orange-800",
    purple: "from-purple-500/10 to-purple-600/10 border-purple-200 dark:border-purple-800",
    gray: "from-gray-500/10 to-gray-600/10 border-gray-200 dark:border-gray-800",
  };

  const iconColorClasses = {
    blue: "bg-blue-100 dark:bg-blue-900",
    green: "bg-green-100 dark:bg-green-900",
    red: "bg-red-100 dark:bg-red-900",
    orange: "bg-orange-100 dark:bg-orange-900",
    purple: "bg-purple-100 dark:bg-purple-900",
    gray: "bg-gray-100 dark:bg-gray-900",
  };

  return (
    <div
      className={`p-4 rounded-xl bg-gradient-to-br ${colorClasses[color]} border hover:shadow-md transition-all duration-200`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`p-2 rounded-lg ${iconColorClasses[color]} text-lg flex-shrink-0`}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {label}
          </div>
          <div
            className="text-lg font-semibold text-white truncate"
            title={value}
          >
            {value}
          </div>
        </div>
      </div>
    </div>
  );
}