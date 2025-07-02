import z from 'zod';
export const passwordSchema = z
  .string()
  .min(5, { message: 'Password must be at least 5 characters long.' });

export const loginSchema = z.object({
  username: z.string(),
  password: passwordSchema,
});

export const registerSchema = z.object({
  username: z.string(),
  name: z.string(),
  whatsapp: z.number().optional(),
  password: passwordSchema,
});

export const updateUser = z.object({
  username: z.string(),
  name: z.string(),
  whatsapp: z.number(),
});
export type loginAuth = z.infer<typeof loginSchema>;
export type RegisterAuth = z.infer<typeof registerSchema>;
export type UpdateUser = z.infer<typeof updateUser>;
export type UserData = {
  id: number; 
  name: string | null;
  username: string;
  role: string;
  whatsapp: string | null;
  balance: number;
  apiKey: string | null;
  otp: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  lastPaymentAt: string | null;

};

export interface UserResponse {
  id: number;
  name: string;
  username: string;
  whatsapp?: string | null
  createdAt: Date;
  balance?: number;
  role: string;
  apiKey?: string | null;
}