import { z } from "zod";

export const recipeSchema = z.object({
  name: z.string().trim().min(1, "El nombre es obligatorio").max(100),
  mealType: z.enum(["BREAKFAST", "LUNCH", "DINNER"]),
  ingredients: z.string().trim().optional(),
  notes: z.string().trim().optional(),
});
export const mealPlanSchema = z.object({
  weekStart: z.string().min(1, "La semana es obligatoria").transform((value) => new Date(value)),
});