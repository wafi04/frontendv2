import { z } from "zod";

export const methodschema = z.object({
  code: z.string().min(2, { message: "Code must be at least 2 characters" }),
  description: z.string(),
  image: z.string(),
  minAmount: z.number().positive().optional(),
  maxAmount: z.number().positive().optional(),
  isActive: z.string(),
  type: z.string(),
  feeType: z.string(),
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  fee: z.number().positive().optional(),
});

export type MethodSchemas = z.infer<typeof methodschema>;
