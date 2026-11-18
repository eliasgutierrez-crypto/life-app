export function getPrismaErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "code" in error) {
    const code = String((error as { code?: unknown }).code);
    if (code === "P2002") return "Ya existe un registro con esos datos";
    if (code === "P2025") return "El registro no fue encontrado";
    if (code === "P2003") return "No se puede eliminar porque tiene registros relacionados";
  }
  return "Ocurrió un error inesperado";
}