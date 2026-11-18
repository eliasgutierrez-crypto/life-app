import { z } from "zod";

export const scheduleBlockSchema = z.object({
  title: z.string().trim().min(1, "El título es obligatorio").max(100),
  description: z.string().trim().optional(),
  color: z.string().trim().optional(),
  startTime: z.coerce.number().int().min(0).max(1439),
  endTime: z.coerce.number().int().min(0).max(1439),
  daysOfWeek: z.array(z.number().int().min(0).max(6)).min(1, "Selecciona al menos un día"),
}).refine((value) => value.startTime < value.endTime, {
  message: "La hora de inicio debe ser anterior a la hora final",
  path: ["endTime"],
});