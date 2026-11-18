import { z } from "zod";

export const habitSchema = z.object({
  name: z.string().trim().min(1, "El nombre es obligatorio").max(100),
  description: z.string().trim().optional(),
  frequency: z.enum(["DAILY", "WEEKLY_X", "SPECIFIC_DAYS"]),
  timesPerWeek: z.coerce.number().int().optional(),
  daysOfWeek: z.array(z.number().int().min(0).max(6)).optional().default([]),
}).superRefine((value, ctx) => {
  if (value.frequency === "WEEKLY_X" && (!value.timesPerWeek || value.timesPerWeek < 1 || value.timesPerWeek > 7)) {
    ctx.addIssue({ code: "custom", path: ["timesPerWeek"], message: "Indica entre 1 y 7 veces por semana" });
  }
  if (value.frequency === "SPECIFIC_DAYS" && value.daysOfWeek.length === 0) {
    ctx.addIssue({ code: "custom", path: ["daysOfWeek"], message: "Selecciona al menos un día" });
  }
});