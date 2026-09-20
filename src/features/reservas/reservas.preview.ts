import type { ReservaDraft, ReservaErrors } from './reservas.types'

/** Validación de la vista previa. Fase 2 debe usar Zod y el contrato del servidor. */
export function validatePreview(
  draft: ReservaDraft,
  salaIds: number[],
): ReservaErrors {
  const errors: ReservaErrors = {}
  if (!draft.salaId || !salaIds.includes(Number(draft.salaId)))
    errors.salaId = 'Elegí un laboratorio del catálogo.'
  if (draft.responsable.trim().length < 3)
    errors.responsable = 'Ingresá tu nombre con al menos 3 caracteres.'
  if (draft.motivo.trim().length < 3)
    errors.motivo = 'Describí el motivo con al menos 3 caracteres.'
  const inicio = new Date(draft.inicio).getTime()
  const fin = new Date(draft.fin).getTime()
  if (!draft.inicio || !Number.isFinite(inicio))
    errors.inicio = 'Indicá la fecha y hora de inicio.'
  if (!draft.fin || !Number.isFinite(fin))
    errors.fin = 'Indicá la fecha y hora de finalización.'
  if (!errors.inicio && !errors.fin && fin <= inicio)
    errors.fin = 'La finalización debe ser posterior al inicio.'
  return errors
}

export function formatPreviewDate(value: string): string {
  return new Intl.DateTimeFormat('es-GT', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}
