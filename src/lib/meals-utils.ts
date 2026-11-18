export const weekDays = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
export function mealTypeLabel(type: string): string {
  return { BREAKFAST: "Desayuno", LUNCH: "Comida", DINNER: "Cena" }[type] ?? type;
}