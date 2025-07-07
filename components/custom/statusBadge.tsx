import { CheckCircle2, Clock, Trash2, XCircle } from "lucide-react"
import { Badge } from "../ui/badge"

export const getStatusBadge = (status: string) => {
    switch (status) {
        case "SUCCESS":
            return (
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Success
                </Badge>
            )
        case "PENDING":
            return (
                <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                    <Clock className="h-3 w-3 mr-1" />
                    Pending
                </Badge>
            )
        case "FAILED":
            return (
                <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                    <XCircle className="h-3 w-3 mr-1" />
                    Failed
                </Badge>
            )
        case "DELETED":
            return (
                <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
                    <Trash2 className="h-3 w-3 mr-1" />
                    Deleted
                </Badge>
            )
        default:
            return (
                <Badge variant="outline">
                    {status}
                </Badge>
            )
    }
}

export const getStatusColor = (status: string) => {
    switch (status) {
        case 'SUCCESS':
            return 'bg-green-50 text-green-700 border-green-200'
        case 'PENDING':
            return 'bg-yellow-50 text-yellow-700 border-yellow-200'
        case 'FAILED':
            return 'bg-red-50 text-red-700 border-red-200'
        case 'DELETED':
            return 'bg-gray-50 text-gray-700 border-gray-200'
        default:
            return 'bg-gray-50 text-gray-700 border-gray-200'
    }
}