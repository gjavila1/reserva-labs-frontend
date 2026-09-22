import { apiFetch } from './http'
import {
  reservaApiSchema,
  salasApiSchema,
  type ReservaApi,
  type SalaConReservas,
} from './schemas'

// Pide al servidor la lista de laboratorios con sus reservas y confirma
// que la respuesta tenga la forma que la aplicacion espera.
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

// Envia una nueva reserva al servidor y confirma que la respuesta tenga
// la forma que la aplicacion espera antes de darla por confirmada.
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
