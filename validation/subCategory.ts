import { z } from "zod";

export const FormSubCategory = z.object({
  name: z.string(),
  categoryId: z.number(),
  code: z.string(),
  isActive: z.string(),
});

export type FormValuesSubCategory = z.infer<typeof FormSubCategory>;