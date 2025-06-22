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
  statusCode: number;
};

export type PaginationResponse<T> = {
  pages: T;
  pageParams: number;
};

export type Pagination = {
  page: number;
  perPage: number;
  totalPages: number;
  totalItems: number;
};

export type CountResponse = {
  count: number;
};