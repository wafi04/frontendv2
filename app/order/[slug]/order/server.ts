import { api } from "@/lib/axios"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

interface CreateOrderTransation {
    productCode: string
    methodCode: string
    gameId: string
    zone?: string
    voucherCode?: string
    whatsAppNumber: string
    nickname: string
    username?: string
}
export function useOrderCreate() {
    return  useMutation({
        mutationKey: ['order'],
        mutationFn: async (data: CreateOrderTransation) => {
            const result = await api.post('/transactions/order', data)
            console.log(result.data)
            return result.data
        },
        onSuccess: () => {
            toast.success("Order successfully created")
        },
        onError: () => {
            toast.error("failed to create transaction")
        }
    })
}
