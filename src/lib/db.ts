import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("Falta la variable de entorno DATABASE_URL");
}

export const db = new Pool({
  connectionString: databaseUrl,
});
