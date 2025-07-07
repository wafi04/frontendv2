import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Eye,
    User,
    Hash,
    DollarSign,
    CreditCard,
    Calendar,
    FileText,
    AlertCircle,
    Copy,
    Check
} from "lucide-react"
import { formatDate, FormatPrice } from "@/utils/format"
import { getStatusBadge, getStatusColor } from "@/components/custom/statusBadge"
import { DepositData } from "@/types/deposit"

interface DepositDetailProps {
    deposit: DepositData
}

export function DepositDetail({ deposit }: DepositDetailProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [copiedField, setCopiedField] = useState<string | null>(null)

    const copyToClipboard = async (text: string, field: string) => {
        try {
            await navigator.clipboard.writeText(text)
            setCopiedField(field)
            setTimeout(() => setCopiedField(null), 2000)
        } catch (err) {
            console.error('Failed to copy text: ', err)
        }
    }


    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 hover:text-blue-700"
                >
                    <Eye className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Deposit Details
                    </DialogTitle>
                </DialogHeader>

                <ScrollArea className="max-h-[70vh]">
                    <div className="space-y-6">
                        {/* Status Header */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <h3 className="text-lg font-semibold">#{deposit.depositId}</h3>
                                {getStatusBadge(deposit.status)}
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-green-600">
                                    {FormatPrice(deposit.amount)}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {formatDate(deposit.createdAt)}
                                </p>
                            </div>
                        </div>

                        {/* User Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <User className="h-4 w-4" />
                                    User Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Username</span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">{deposit.username}</span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 w-6 p-0"
                                            onClick={() => copyToClipboard(deposit.username, 'username')}
                                        >
                                            {copiedField === 'username' ? (
                                                <Check className="h-3 w-3 text-green-600" />
                                            ) : (
                                                <Copy className="h-3 w-3" />
                                            )}
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">User ID</span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">#{deposit.id}</span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 w-6 p-0"
                                            onClick={() => copyToClipboard(deposit.id.toString(), 'userId')}
                                        >
                                            {copiedField === 'userId' ? (
                                                <Check className="h-3 w-3 text-green-600" />
                                            ) : (
                                                <Copy className="h-3 w-3" />
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Transaction Details */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <Hash className="h-4 w-4" />
                                    Transaction Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Deposit ID</span>
                                    <div className="flex items-center gap-2">
                                        <code className=" px-2 py-1 rounded text-sm font-mono">
                                            {deposit.depositId}
                                        </code>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 w-6 p-0"
                                            onClick={() => copyToClipboard(deposit.depositId, 'depositId')}
                                        >
                                            {copiedField === 'depositId' ? (
                                                <Check className="h-3 w-3 text-green-600" />
                                            ) : (
                                                <Copy className="h-3 w-3" />
                                            )}
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Amount</span>
                                    <span className="font-semibold text-lg">
                                        {FormatPrice(deposit.amount)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Method</span>
                                    <Badge variant="outline" className="font-medium">
                                        {deposit.method}
                                    </Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Status</span>
                                    <Badge className={getStatusColor(deposit.status)}>
                                        {deposit.status}
                                    </Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Payment Reference</span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">
                                            {deposit.paymentReference || "N/A"}
                                        </span>
                                        {deposit.paymentReference && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-6 w-6 p-0"
                                                onClick={() => copyToClipboard(deposit.paymentReference, 'paymentRef')}
                                            >
                                                {copiedField === 'paymentRef' ? (
                                                    <Check className="h-3 w-3 text-green-600" />
                                                ) : (
                                                    <Copy className="h-3 w-3" />
                                                )}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Timestamps */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <Calendar className="h-4 w-4" />
                                    Timeline
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Created At</span>
                                    <span className="font-medium">
                                        {formatDate(deposit.createdAt)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Updated At</span>
                                    <span className="font-medium">
                                        {formatDate(deposit.updatedAt)}
                                    </span>
                                </div>
                                {deposit.updatedAt !== deposit.createdAt && (
                                    <div className="flex items-center gap-2 text-sm text-amber-600  p-2 rounded">
                                        <AlertCircle className="h-4 w-4" />
                                        <span>This deposit has been modified after creation</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Log Information */}
                        {deposit.log && (
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="flex items-center gap-2 text-base">
                                        <FileText className="h-4 w-4" />
                                        Transaction Log
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                                        {deposit.log}
                                    </pre>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}