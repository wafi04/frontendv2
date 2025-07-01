import { PaginationMeta } from "./category";
import { API_RESPONSE } from "./response";

// Types
export interface VoucherData {
  id: number;
  code: string;
  description?: string;
  discountType: string
  discountValue: number;
  maxDiscount?: number;
  minPurchase?: number;
  startDate: string;
  expiryDate: string;
  usageLimit?: number;
  usageCount: number;
  isActive: string
  isForAllCategories: string
  categoryIds?: number[];
  categories: any[];
  usages?: any[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateVoucherInput {
  code: string;
  description?: string;
  discountType: string
  discountValue: number;
  maxDiscount?: number;
  minPurchase?: number;
  startDate: string;
  expiryDate: string;
  usageLimit?: number;
  isActive?: string
  isForAllCategories?: string
  categoryIds?: number[];
}

export interface UpdateVoucherInput extends Partial<CreateVoucherInput> {}

export interface ValidateVoucherInput {
  code: string;
  amount: number;
  categoryId?: number;
}

export interface UseVoucherInput {
  voucherId: number;
  orderId: string;
  amount: number;
  username?: string;
  whatsapp?: string;
}

export interface VoucherFilters {
  isActive?: string;
  discountType?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface VoucherResponse {
  data: VoucherData[];
}

export interface SingleVoucherResponse {
  data: VoucherData
}


export interface VoucherPagination extends VoucherResponse {
    meta : PaginationMeta
}


export type VoucherReseponseWithPagination = API_RESPONSE<VoucherPagination>