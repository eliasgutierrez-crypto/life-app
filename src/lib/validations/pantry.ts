import { z } from "zod";

export const pantryItemSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "El nombre es obligatorio")
    .max(100, "Máximo 100 caracteres"),
  currentQty: z.coerce
    .number()
    .min(0, "La cantidad no puede ser negativa")
    .max(9999999, "Cantidad demasiado grande"),
  unit: z
    .string()
    .trim()
    .min(1, "La unidad es obligatoria")
    .max(20, "Máximo 20 caracteres"),
  minStock: z.coerce
    .number()
    .min(0, "El stock mínimo no puede ser negativo")
    .max(9999999, "Stock mínimo demasiado grande")
    .default(0),
  expiresAt: z
    .string()
    .optional()
    .transform((v) => (v && v.length > 0 ? new Date(v) : null)),
});

export type PantryItemInput = z.infer<typeof pantryItemSchema>;