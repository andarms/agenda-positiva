import { db } from "./index";
import {
  $usuarios_sistema,
  type InsertUsuarioSistema,
  type SelectUsuarioSistema,
} from "./schema";
import { eq } from "drizzle-orm";

/**
 * Add an email to the whitelist
 */
export async function agregar_usuario_sistema(
  datos: Omit<InsertUsuarioSistema, "id">,
): Promise<SelectUsuarioSistema> {
  const [nuevo_usuario] = await db
    .insert($usuarios_sistema)
    .values(datos)
    .returning();

  return nuevo_usuario;
}

/**
 * Check if an email is whitelisted
 */
export async function verificar_usuario_permitido(
  email: string,
): Promise<boolean> {
  const [usuario] = await db
    .select()
    .from($usuarios_sistema)
    .where(eq($usuarios_sistema.email, email))
    .limit(1);

  if (!usuario) return false;
  return usuario.activo === 1;
}

/**
 * Get user from whitelist by email
 */
export async function obtener_usuario_sistema(
  email: string,
): Promise<SelectUsuarioSistema | undefined> {
  const [usuario] = await db
    .select()
    .from($usuarios_sistema)
    .where(eq($usuarios_sistema.email, email))
    .limit(1);

  return usuario;
}

/**
 * Get all whitelisted users
 */
export async function obtener_todos_usuarios_sistema(): Promise<
  SelectUsuarioSistema[]
> {
  return await db.select().from($usuarios_sistema);
}

/**
 * Update a user status
 */
export async function actualizar_usuario_sistema(
  email: string,
  datos: Partial<Omit<InsertUsuarioSistema, "id">>,
): Promise<void> {
  await db
    .update($usuarios_sistema)
    .set(datos)
    .where(eq($usuarios_sistema.email, email));
}

/**
 * Remove a user from whitelist
 */
export async function eliminar_usuario_sistema(email: string): Promise<void> {
  await db.delete($usuarios_sistema).where(eq($usuarios_sistema.email, email));
}
