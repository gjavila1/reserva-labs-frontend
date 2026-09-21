import { apiFetch } from './http'
import {
  reservaApiSchema,
  salasApiSchema,
  type ReservaApi,
  type SalaConReservas,
} from './schemas'

export async function listarSalas(
  signal?: AbortSignal,
): Promise<SalaConReservas[]> {
  const data = await apiFetch<unknown>('/api/salas', { signal })
  const parsed = salasApiSchema.safeParse(data)
  if (!parsed.success) {
    throw new Error('La respuesta del servidor no tiene el formato esperado.')
  }
  return parsed.data
}

export interface CrearReservaPayload {
  responsable: string
  motivo: string
  inicio: string
  fin: string
}

export async function crearReserva(
  salaId: number,
  payload: CrearReservaPayload,
  signal?: AbortSignal,
): Promise<ReservaApi> {
  const data = await apiFetch<unknown>(`/api/salas/${salaId}/reservas`, {
    method: 'POST',
    body: payload,
    signal,
  })
  const parsed = reservaApiSchema.safeParse(data)
  if (!parsed.success) {
    throw new Error('La respuesta del servidor no tiene el formato esperado.')
  }
  return parsed.data
}
