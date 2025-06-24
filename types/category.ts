import { FormValuesCategory } from "@/validation/category"
import { API_RESPONSE } from "./response"

export interface PaginationMeta {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface  CategoryData extends FormValuesCategory{
    id: number
    createdAt: string
    updatedAt : string
}
export interface CategoryResponse {
  data: CategoryData[];
}

export interface SingleCategoryResponse {
  data: CategoryData;
}


export interface CategoryPagination extends CategoryResponse {
    meta : PaginationMeta
}

export type CategoryReseponseWithPagination = API_RESPONSE<CategoryPagination>