import z from "zod";

export const updateUserSchema = z.object({
    name : z.string(),
    balance : z.number(),
    role :  z.string()
})
export type UpdateUsers = z.infer<typeof updateUserSchema>