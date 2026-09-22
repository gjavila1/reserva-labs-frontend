import { z } from 'zod'

// Describe como debe verse una reserva que llega desde el servidor.
// Sigue el contrato de la guia del curso, todavia pendiente de confirmar
// con el equipo que construye el servidor real, segun se explica en docs/FASE2.md.
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
  reservas: z.array(reservaApiSchema),
})

// Describe la lista completa de laboratorios que devuelve el servidor.
export const salasApiSchema = z.array(salaApiSchema)

export type ReservaApi = z.infer<typeof reservaApiSchema>
export type SalaConReservas = z.infer<typeof salaApiSchema>
