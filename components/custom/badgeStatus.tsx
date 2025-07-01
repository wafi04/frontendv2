import { RecentTransactions } from "@/types/transactions";

export const getStatusStyle = (status: string) => {
    switch (status) {
        case 'SUCCESS':
            return 'bg-green-100 text-green-800 border-green-200';
        case 'PENDING':
            return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'FAILED':
            return 'bg-red-100 text-red-800 border-red-200';
        default:
            return 'bg-gray-100 text-gray-800 border-gray-200';
    }
};

// Get transaction type styling
export const getTypeStyle = (type: string) => {
    switch (type) {
        case 'DEPOSIT':
            return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'PURCHASE':
            return 'bg-purple-100 text-purple-800 border-purple-200';
        case 'WITHDRAWAL':
            return 'bg-orange-100 text-orange-800 border-orange-200';
        default:
            return 'bg-gray-100 text-gray-800 border-gray-200';
    }
};

export const getTypeVariant = (type: RecentTransactions['transaction_type']): "default" | "secondary" | "outline" => {
    switch (type) {
        case 'DEPOSIT':
            return 'default';
        case 'MEMBERSHIP':
            return 'secondary';
        case 'TOPUP':
            return 'outline';
        default:
            return 'outline';
    }
};
