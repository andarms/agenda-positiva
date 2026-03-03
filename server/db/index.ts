import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

// Environment variables validation
const TURSO_CONNECTION_URL = process.env.TURSO_CONNECTION_URL;
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;

if (!TURSO_CONNECTION_URL || !TURSO_AUTH_TOKEN) {
  console.error("⚠️  Database configuration missing!");
  console.error(
    "Please set TURSO_CONNECTION_URL and TURSO_AUTH_TOKEN in your .env file",
  );
  console.error("Example .env file:");
  console.error("TURSO_CONNECTION_URL=libsql://your-database.turso.io");
  console.error("TURSO_AUTH_TOKEN=your-auth-token");

  // For development, create a mock client that throws meaningful errors
  throw new Error(
    "Database not configured. Please add TURSO_CONNECTION_URL and TURSO_AUTH_TOKEN to your .env file.",
  );
}

const client = createClient({
  url: TURSO_CONNECTION_URL,
  authToken: TURSO_AUTH_TOKEN,
});

export const db = drizzle(client);
