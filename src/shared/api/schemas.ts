import { z } from 'zod'

/**
 * Contrato documentado en la guia del curso (Fases 1-3 del backend).
 * GET /api/salas incluye las reservas de cada sala (prisma include: { reservas: true }).
 * Pendiente de confirmar contra el backend real: ver docs/FASE2.md.
 */
export const reservaApiSchema = z.object({
  id: z.number().int().positive(),
  responsable: z.string(),
  motivo: z.string(),
  inicio: z.coerce.date(),
  fin: z.coerce.date(),
  salaId: z.number().int().positive(),
})

export const salaApiSchema = z.object({
  id: z.number().int().positive(),
  nombre: z.string(),
  edificio: z.string(),
  capacidad: z.number().int().positive(),
  reservas: z.array(reservaApiSchema),
})

export const salasApiSchema = z.array(salaApiSchema)

export type ReservaApi = z.infer<typeof reservaApiSchema>
export type SalaConReservas = z.infer<typeof salaApiSchema>
