import { DepositData } from "../invoice/page";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  Eye,
  Copy,
  CheckCircle2,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { getStatusBadge } from "@/components/custom/utils";
import { formatDate, FormatPrice } from "@/utils/format";
import { PaginationMeta } from "@/types/category";
import { Pagination } from "@/components/custom/pagination";
import { useFilter } from "@/hooks/usefilter";
import { useGetDepositByusername } from "./server";

export default function DepositHistory({ username }: { username?: string }) {
  const { currentPage, setCurrentPage } = useFilter("deposit-history");
  const { data: depositData } = useGetDepositByusername(username, {
    page: currentPage.toString(),
  });

  const router = useRouter();
  const handleViewInvoice = (depositId: string) => {
    router.push(`/profile/invoice?depositId=${depositId}`);
  };

  const data = depositData?.data as DepositData[];
  const meta = depositData?.meta as PaginationMeta;

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <TrendingUp className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            Belum Ada Riwayat Deposit
          </h3>
          <p className="text-muted-foreground text-center">
            Riwayat deposit Anda akan muncul di sini setelah melakukan transaksi
            pertama.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Riwayat Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="">
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Metode</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((deposit) => {
                  const statusBadge = getStatusBadge(deposit.status);

                  return (
                    <TableRow
                      key={deposit.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <TableCell className="font-mono text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">#</span>
                          <span>{deposit.deposit_id.slice(-8)}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium text-sm">
                            {formatDate(deposit.created_at)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatDate(deposit.updated_at)}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge variant="outline" className="uppercase text-xs">
                          {deposit.method}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-right font-semibold">
                        {FormatPrice(deposit.amount)}
                      </TableCell>

                      <TableCell className="text-center">
                        <Badge variant={statusBadge.variant}>
                          {statusBadge.icon}
                          {statusBadge.text}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleViewInvoice(deposit.deposit_id)
                            }
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>

                          {deposit.status.toLowerCase() === "pending" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                window.open(deposit.payment_reference, "_blank")
                              }
                              className="h-8 w-8 p-0"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center pt-6 w-full">
        {meta && (
          <Pagination
            currentPage={meta.currentPage}
            totalPages={meta.totalPages}
            hasNextPage={meta.hasNextPage}
            hasPrevPage={meta.hasPrevPage}
            totalItems={meta.totalItems}
            itemsPerPage={meta.itemsPerPage}
            onPageChange={setCurrentPage}
          />
        )}
      </CardFooter>
    </Card>
  );
}
