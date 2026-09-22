import { z } from 'zod'

// Describe que direccion de servidor debe tener la aplicacion para poder arrancar.
const envSchema = z.object({
  VITE_API_URL: z
    .string({ error: 'VITE_API_URL falta en tu .env.local' })
    .trim()
    .url(
      'VITE_API_URL debe ser una URL valida, por ejemplo http://localhost:3010',
    ),
})

// Revisa la configuracion apenas arranca la aplicacion y detiene todo si falta algo.
const parsed = envSchema.safeParse(import.meta.env)
if (!parsed.success) {
  throw new Error(
    'Configuracion invalida. Copia .env.example a .env.local y define VITE_API_URL: ' +
      JSON.stringify(parsed.error.flatten().fieldErrors),
  )
}

export const env = parsed.data
