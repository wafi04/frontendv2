import { api } from "@/lib/axios"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useSocket } from "@/hooks/useSocket" 
import { useEffect } from "react"
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
    const { socket, isConnected } = useSocket()

    return useMutation({
        mutationKey: ['order'],
        mutationFn: async (data: CreateOrderTransation) => {
            const result = await api.post<API_RESPONSE<OrderResponse>>('/transactions/order', data)
            return result.data 
        },
        onSuccess: (data) => {
            toast.success("Order successfully created")
            
            if (socket && isConnected && data.data.data.orderId) {
                socket.emit('subscribe_transaction', { orderId: data.data.data.orderId })
                // Listen for transaction updates
                socket.on('transaction_update', (update) => {
                    if (update.orderId === data.data.data.orderId) {
                        queryClient.setQueryData(['order', data.data.data.orderId], update)
                        switch (update.status) {
                            case 'processing':
                                toast.info("Order is being processed")
                                break
                            case 'completed':
                                toast.success("Order completed successfully!")
                                break
                            case 'failed':
                                toast.error("Order failed")
                                break
                            case 'cancelled':
                                toast.warning("Order was cancelled")
                                break
                        }
                    }
                })
            }
        },
        onError: () => {
            toast.error("Failed to create transaction")
        }
    })
}
