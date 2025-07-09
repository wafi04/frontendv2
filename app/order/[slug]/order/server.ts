import { api } from "@/lib/axios"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { API_RESPONSE } from "@/types/response"

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


interface OrderResponse {
    data : {

        amount : number
        discount :  number
        fee :  number
        finalAmount :  number
        orderId :  string
        paymentMethod :  string
        paymentUrl :  string
        productName :  string
        qrString : string
        reference :  string
        timestamp : string
    }
}

export function useOrderCreate() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ['order'],
        mutationFn: async (data: CreateOrderTransation) => {
            const result = await api.post<API_RESPONSE<OrderResponse>>('/transactions/order', data)
            return result.data 
        },
        onSuccess: (data) => {
            toast.success("Order successfully created")
        },
        onError: () => {
            toast.error("Failed to create transaction")
        }
    })
}
