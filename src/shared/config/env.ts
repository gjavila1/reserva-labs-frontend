import { z } from 'zod'

/** Configuracion publica centralizada. Ver .env.example; nunca agregar secretos. */
const envSchema = z.object({
  VITE_API_URL: z
    .string({ error: 'VITE_API_URL falta en tu .env.local' })
    .trim()
    .url(
      'VITE_API_URL debe ser una URL valida, por ejemplo http://localhost:3010',
    ),
})

const parsed = envSchema.safeParse(import.meta.env)
if (!parsed.success) {
  throw new Error(
    'Configuracion invalida. Copia .env.example a .env.local y define VITE_API_URL: ' +
      JSON.stringify(parsed.error.flatten().fieldErrors),
  )
}

export const env = parsed.data
