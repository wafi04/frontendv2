import type React from "react"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { FormatPrice } from "@/utils/format"
import type { RecentTransactions } from "@/types/transactions"

interface ExpandedTransactionDetailsProps {
  transaction: RecentTransactions
}

export const ExpandedTransactionDetails: React.FC<ExpandedTransactionDetailsProps> = ({ transaction }) => {
  return (
    <div className="mx-6 my-4 rounded-xl border border-gray-200 bg-card p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Transaction Details - Left Side */}
        <div>
          <div className="mb-6 flex items-center gap-3">
            <div className="h-8 w-2 rounded-full bg-gradient-to-b from-blue-500 to-indigo-500"></div>
            <h4 className="text-lg font-semibold">Transaction Details</h4>
          </div>

          <Table>
            <TableBody>
                <TableRow>
                <TableCell className="font-semibold">Transaction ID</TableCell>
                <TableCell className="font-mono text-sm">{transaction.orderId}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="w-1/2 font-semibold">Harga Beli</TableCell>
                <TableCell>{FormatPrice(transaction.purchasePrice ?? 0)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold">Harga Jual</TableCell>
                <TableCell>{FormatPrice(transaction.price)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold">Profit</TableCell>
                <TableCell
                  className={
                    transaction.profitAmount > 0 ? "text-green-600" : transaction.profitAmount < 0 ? "text-red-600" : ""
                  }
                >
                  {FormatPrice(transaction.profitAmount)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold">Biaya Admin</TableCell>
                <TableCell>{FormatPrice(transaction.paymentDetail.feeAmount)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold">Total Dibayar</TableCell>
                <TableCell className="font-semibold text-lg">
                  {FormatPrice(transaction.paymentDetail.totalAmount)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold">Nomor Tujuan</TableCell>
                <TableCell>{`${transaction.userId}${transaction.zone ? `-${transaction.zone}` : ""}`}</TableCell>
              </TableRow>
              
            </TableBody>
          </Table>
        </div>

        {/* Payment Details - Right Side */}
        <div>
          <div className="mb-6 flex items-center gap-3">
            <div className="h-8 w-2 rounded-full bg-gradient-to-b from-green-500 to-emerald-500"></div>
            <h4 className="text-lg font-semibold">Payment Details</h4>
          </div>

          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="w-1/2 font-semibold">Metode</TableCell>
                <TableCell>{transaction.paymentDetail.method}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold">Status Pembayaran</TableCell>
                <TableCell>{transaction.paymentDetail.status}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold">Nomor Pembayaran</TableCell>
                <TableCell>{transaction.paymentDetail.paymentNumber || "-"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold">Nomor Pembeli</TableCell>
                <TableCell>{transaction.paymentDetail.buyerNumber}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold">Reference</TableCell>
                <TableCell>{transaction.paymentDetail.reference || "-"}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold">Dibuat</TableCell>
                <TableCell>{new Date(transaction.paymentDetail.createdAt).toLocaleString()}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold">Diperbarui</TableCell>
                <TableCell>{new Date(transaction.paymentDetail.updatedAt).toLocaleString()}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Transaction Log - Full Width Below */}
      {transaction.log && (
        <div className="mt-8 rounded-lg p-4">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-lg">📝</span>
            <h5 className="font-semibold text-gray-900 dark:text-gray-100">Transaction Log</h5>
          </div>
          <div className="rounded-md border border-gray-200 p-3 dark:border-gray-600 dark:bg-gray-900">
            <pre className="font-mono text-sm leading-relaxed text-gray-700 whitespace-pre-wrap dark:text-gray-300">
              {transaction.log}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}
