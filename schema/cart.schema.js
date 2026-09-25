import z from "zod";

export const addToCartSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number().positive(),
  image: z.string(),
  quantity: z.number().int().positive(),
});




export const updateCartSchema = z.object({
  quantity: z.number().int().positive(),
});