import { z } from 'zod'
import type { ReservaErrors } from './reservas.types'

/**
 * Mismas reglas que el backend (crearReservaSchema en la guia del curso):
 * el cliente valida para dar feedback rapido, el servidor valida siempre.
 * Pendiente confirmar con el equipo de backend real: ver docs/FASE2.md.
 */
export const reservaFormSchema = z
  .object({
    salaId: z.coerce
      .number({ error: 'Elegi un laboratorio del catalogo.' })
      .int()
      .positive('Elegi un laboratorio del catalogo.'),
    responsable: z
      .string()
      .trim()
      .min(3, 'Ingresa tu nombre con al menos 3 caracteres.')
      .max(80, 'El nombre es demasiado largo.'),
    motivo: z
      .string()
      .trim()
      .min(3, 'Describi el motivo con al menos 3 caracteres.')
      .max(200, 'El motivo es demasiado largo.'),
    inicio: z.coerce.date({ error: 'Indica la fecha y hora de inicio.' }),
    fin: z.coerce.date({ error: 'Indica la fecha y hora de finalizacion.' }),
  })
  .refine((data) => data.fin > data.inicio, {
    message: 'La finalizacion debe ser posterior al inicio.',
    path: ['fin'],
  })
  .refine((data) => data.inicio.getTime() > Date.now(), {
    message: 'No podes reservar en el pasado.',
    path: ['inicio'],
  })

export type ReservaFormInput = z.input<typeof reservaFormSchema>
export type ReservaFormOutput = z.output<typeof reservaFormSchema>

export function validateReservaForm(input: ReservaFormInput): {
  errors: ReservaErrors
  data: ReservaFormOutput | null
} {
  const result = reservaFormSchema.safeParse(input)
  if (result.success) return { errors: {}, data: result.data }
  const fieldErrors = result.error.flatten().fieldErrors
  const errors: ReservaErrors = {}
  for (const key of Object.keys(fieldErrors) as (keyof typeof fieldErrors)[]) {
    const messages = fieldErrors[key]
    if (messages?.length) errors[key as keyof ReservaErrors] = messages[0]
  }
  return { errors, data: null }
}
