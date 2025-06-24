import { PaginationMeta } from "./category";
import { API_RESPONSE, PaginationParams } from "./response";

export type SubCategory = {
  id: number;
  name: string;
  createdAt: string | null;
  updatedAt: string | null;
  code: string;
  categoryId: number;
  isActive: string;
};


export type FilterSubCategories = PaginationParams &{
  status?: string
  search? : string
}

export interface SubCategoryResponse {
  data: SubCategory[];
}

export interface SingleSubCategoryResponse {
  data: SubCategory
}


export interface SubCategoryPagination extends SubCategoryResponse {
    meta : PaginationMeta
}

export type SubCategoryReseponseWithPagination = API_RESPONSE<SubCategoryPagination>