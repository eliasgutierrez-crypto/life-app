import { z } from "zod";

export const debtSchema = z.object({
  name: z.string().trim().min(1, "El nombre es obligatorio").max(100),
  principal: z.coerce.number().positive("El monto debe ser mayor a cero"),
  annualRate: z.coerce.number().min(0, "La tasa no puede ser negativa").max(100),
  startDate: z.string().min(1, "La fecha es obligatoria").transform((value) => new Date(value)),
  termMonths: z.coerce.number().int().min(1, "El plazo debe ser de al menos 1 mes").max(600),
});