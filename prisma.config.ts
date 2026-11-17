import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    // El CLI (migraciones) debe usar la conexión directa.
    // La app en runtime usará DATABASE_URL a través del cliente.
    url: process.env.DIRECT_URL || env("DATABASE_URL"),
  },
});