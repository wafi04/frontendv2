import { ReactNode } from "react";

export interface WithChildren {
  children: ReactNode;
}
export interface ErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export type API_RESPONSE<T> = {
  message: string;
  data: T;
  status: boolean;
};



export type CountResponse = {
  count: number;
};


export interface PaginationParams {
  limit?: string
  page?: string
}

export interface FilterCategories extends PaginationParams {
  search?: string
  status?: string
}