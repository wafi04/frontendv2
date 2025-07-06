import { PaginationMeta } from "./category"

export type DepositData =  {
    amount: number
    createdAt: string
    depositId: string
    id: number
    log: string
    method: string
    paymentReference: string
    status: string
    updatedAt: string
    username: string
}


export type DepositWithPagination = {
    data: DepositData[]
    meta : PaginationMeta
}