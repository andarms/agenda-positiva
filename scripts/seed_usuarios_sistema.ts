import { config } from "dotenv";
import { drizzle } from "drizzle-orm/libsql";
import { $usuarios_sistema } from "../server/db/schema";

// Cargar las variables de entorno
config({ path: ".env.local" });
config({ path: ".env" }); // Fallback si no existe .env.local

const db = drizzle({
  connection: {
    url: process.env.TURSO_CONNECTION_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
});

const usuarios_whitelist = [
  {
    email: "admin@example.com",
    nombre: "Administrador",
    activo: 1,
  },
  {
    email: "user@example.com",
    nombre: "Usuario Prueba",
    activo: 1,
  },
];

async function seed() {
  console.log("🌱 Iniciando seed de usuarios sistema...");

  try {
    // Clear existing data (optional - comment out if you want to preserve)
    // await db.delete($usuarios_sistema);

    // Insert new data
    const resultado = await db
      .insert($usuarios_sistema)
      .values(usuarios_whitelist)
      .onConflictDoNothing(); // No sobreescribir si ya existen

    console.log(`✅ Se agregaron usuarios a la whitelist`);
    console.log(`📊 Usuarios agregados:`, usuarios_whitelist.length);

    // Mostrar usuarios actuales
    const usuarios_actuales = await db.select().from($usuarios_sistema);
    console.log("\n📋 Usuarios en la whitelist:");
    usuarios_actuales.forEach((usuario) => {
      console.log(
        `  - ${usuario.email} (${usuario.nombre}) [${usuario.activo ? "Activo" : "Inactivo"}]`,
      );
    });
  } catch (error) {
    console.error("❌ Error durante el seed:", error);
    process.exit(1);
  }

  console.log("\n✨ Seed completado exitosamente");
  process.exit(0);
}

seed();
