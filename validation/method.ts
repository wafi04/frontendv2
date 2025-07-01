import { z } from "zod";

export const methodschema = z.object({
  code: z.string().min(2, { message: "Code must be at least 2 characters" }),
  description: z.string(),
  maxExpired: z.string().optional(),
  image: z.string(),
  minExpired: z.string().optional(),
  minAmount: z.string().optional(),
  maxAmount: z.string().optional(),
  isActive: z.string(),
  type: z.string(),
  taxType: z.string().optional(),
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  taxAdmin: z.string().optional(),
});

export type MethodSchemas = z.infer<typeof methodschema>;
