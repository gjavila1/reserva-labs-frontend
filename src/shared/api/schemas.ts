import { z } from 'zod'

// Describe como debe verse una reserva que llega desde el servidor real.
// El contrato compartido y sus comprobaciones se documentan en docs/FASE2.md.
export const reservaApiSchema = z.object({
  id: z.number().int().positive(),
  responsable: z.string(),
  motivo: z.string(),
  inicio: z.coerce.date(),
  fin: z.coerce.date(),
  salaId: z.number().int().positive(),
})

// Describe como debe verse un laboratorio, junto con sus reservas del dia.
export const salaApiSchema = z.object({
  id: z.number().int().positive(),
  nombre: z.string(),
  edificio: z.string(),
  capacidad: z.number().int().positive(),
  imagenUrl: z.string().url().nullable().optional(),
  reservas: z.array(reservaApiSchema),
})

// Describe la lista completa de laboratorios que devuelve el servidor.
export const salasApiSchema = z.array(salaApiSchema)

export type ReservaApi = z.infer<typeof reservaApiSchema>
export type SalaConReservas = z.infer<typeof salaApiSchema>
