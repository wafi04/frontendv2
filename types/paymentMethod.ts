export interface PaymentMethodData {
  name: string;
  id: number;
  type: string;
  createdAt: string | null;
  updatedAt: string | null;
  code: string;
  image: string;
  description: string;
  minAmount: number | null;
  taxType: string | null;
  taxAdmin: number | null;
  minExpired: number | null;
  maxExpired: number | null;
  maxAmount: number | null;
  isActive: string
}