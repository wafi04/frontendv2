export interface PaymentMethod {
  id: number;
  code: string;
  name: string;
  description: string;
  image: string;
  type: string
  minAmount: number;
  maxAmount: number;
  fee: number;
  feeType: string
  status: string;
  createdAt: string; // ISO format or Date
  updatedAt: string; // ISO format or Date
}

export interface CreateMethodData {
  code: string;
  name: string;
  description?: string;
  image: string;
  type: string
  minAmount: number;
  maxAmount: number;
  fee: number;
  feeType: string
  status: string;
}

export interface UpdateMethodData {
  name?: string;
  description?: string;
  image: string;
  type?: string
  minAmount?: number;
  maxAmount?: number;
  fee?: number;
  feeType?: string
  status?: string;
}
