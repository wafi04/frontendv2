import { getStatusBadge } from "@/components/custom/statusBadge"
import { useGetHistoryTransaction } from "./server"
import { formatDate } from "@/utils/format"
import { Pagination } from "@/components/custom/pagination"
import { useFilter } from "@/hooks/usefilter"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Download } from "lucide-react"
import { useState } from "react"

export function TransactionsHistory({username} : {username? : string}){
    const { currentPage, setCurrentPage } = useFilter("transaction-history")
    const [copyStatus, setCopyStatus] = useState("")
    
    const {data} = useGetHistoryTransaction(username,{
        page : currentPage.toString()
    })

    // Handle loading state
    if (!data) {
        return (
            <main className="p-6">
                <div className="flex justify-center items-center h-64">
                    <div className="text-muted-foreground">Loading transactions...</div>
                </div>
            </main>
        )
    }

    // Handle empty data
    if (!data.data || data.data.length === 0) {
        return (
            <main className="p-6">
                <Card>
                    <CardContent className="p-8 text-center text-muted-foreground">
                        No transactions found
                    </CardContent>
                </Card>
            </main>
        )
    }

    const copyTableData = async () => {
        try {
            const headers = ["Order ID", "Service", "User ID", "Zone", "Amount", "Method", "Status", "Created At"]
            
            const rows = data.data.map(transaction => [
                transaction.orderId,
                transaction.serviceName,
                transaction.userId,
                transaction.zone || "-",
                `Rp ${transaction.totalAmount?.toLocaleString('id-ID') || 0}`,
                transaction.method,
                transaction.status,
                formatDate(transaction.createdAt)
            ])
            
            // Combine header and rows
            const allRows = [headers, ...rows]
            
            const tsvContent = allRows.map(row => row.join('\t')).join('\n')
            
            await navigator.clipboard.writeText(tsvContent)
            setCopyStatus("Copied!")
            setTimeout(() => setCopyStatus(""), 2000)
        } catch (err) {
            setCopyStatus("Failed to copy")
            setTimeout(() => setCopyStatus(""), 2000)
        }
    }

    const downloadCSV = () => {
        // Create header
        const headers = ["Order ID", "Service", "Nickname", "User ID", "Zone", "Total Amount", "Base Price", "Discount", "Method", "Status", "Created At", "Updated At"]
        
        // Create rows data
        const rows = data.data.map(transaction => [
            transaction.orderId,
            transaction.serviceName,
            transaction.nickname || "",
            transaction.userId,
            transaction.zone || "",
            transaction.totalAmount || 0,
            transaction.price || 0,
            transaction.discount || 0,
            transaction.method,
            transaction.status,
            transaction.createdAt,
            transaction.updatedAt
        ])
        
        const allRows = [headers, ...rows]
        
        // Convert to CSV
        const csvContent = allRows.map(row => 
            row.map(field => `"${field}"`).join(',')
        ).join('\n')
        
        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement("a")
        const url = URL.createObjectURL(blob)
        link.setAttribute("href", url)
        link.setAttribute("download", `transactions_${new Date().toISOString().split('T')[0]}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <main className="p-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Transaction History</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                                Total: {data.data.length} transactions
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button 
                                variant="outline" 
                                size="sm"
                                onClick={copyTableData}
                                disabled={copyStatus === "Copying..."}
                            >
                                <Copy className="h-4 w-4 mr-2" />
                                {copyStatus || "Copy Table"}
                            </Button>
                            <Button 
                                variant="outline" 
                                size="sm"
                                onClick={downloadCSV}
                            >
                                <Download className="h-4 w-4 mr-2" />
                                Export CSV
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-md overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="border-b bg-muted/50">
                                    <tr>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Order ID</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Service</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">User Details</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Amount</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Payment</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.data.map((transaction, index) => (
                                        <tr key={transaction.orderId || index} className="border-b transition-colors hover:bg-muted/50">
                                            <td className="p-4 align-middle">
                                                <div className="font-mono text-sm">
                                                    {transaction.orderId}
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle">
                                                <div>
                                                    <div className="font-medium">
                                                        {transaction.serviceName}
                                                    </div>
                                                    {transaction.nickname && (
                                                        <div className="text-sm text-muted-foreground">
                                                            {transaction.nickname}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle">
                                                <div className="text-sm">
                                                    <div>ID: {transaction.userId}</div>
                                                    {transaction.zone && (
                                                        <div className="text-muted-foreground">Zone: {transaction.zone}</div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle">
                                                <div className="text-sm">
                                                    <div className="font-medium">
                                                        Rp {transaction.totalAmount?.toLocaleString('id-ID') || 0}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        Base: Rp {transaction.price?.toLocaleString('id-ID') || 0}
                                                        {transaction.discount > 0 && (
                                                            <span className="text-green-600"> (-{transaction.discount})</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle">
                                                <div className="text-sm">
                                                    <div className="font-medium">{transaction.method}</div>
                                                    
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle">
                                                {getStatusBadge(transaction.status)}
                                            </td>
                                            <td className="p-4 align-middle">
                                                <div className="text-sm">
                                                    <div>{formatDate(transaction.createdAt)}</div>
                                                    {transaction.updatedAt !== transaction.createdAt && (
                                                        <div className="text-xs text-muted-foreground">
                                                            Updated: {formatDate(transaction.updatedAt)}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pagination */}
                    {data.meta && (
                        <div className="mt-4">
                            <Pagination
                                currentPage={data.meta.currentPage}
                                totalPages={data.meta.totalPages}
                                hasNextPage={data.meta.hasNextPage}
                                hasPrevPage={data.meta.hasPrevPage}
                                totalItems={data.meta.totalItems}
                                itemsPerPage={data.meta.itemsPerPage}
                                onPageChange={setCurrentPage}
                            />
                        </div>
                    )}
                </CardContent>
            </Card>
        </main>
    )
}