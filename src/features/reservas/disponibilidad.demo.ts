import type { Sala } from '../salas/salas.types'

export interface BusquedaHorario {
  fecha: string
  hora: number
  duracion: number
  personas: number
}
export interface SeleccionHorario {
  sala: Sala
  inicio: string
  fin: string
}
export interface IntervaloDemo {
  inicio: number
  fin: number
}

// Agenda ficticia repetida cada día. Nunca representa disponibilidad del servidor.
const agenda: Record<number, IntervaloDemo[]> = {
  1: [
    { inicio: 10, fin: 11 },
    { inicio: 14, fin: 16 },
  ],
  2: [
    { inicio: 8, fin: 9 },
    { inicio: 12, fin: 14 },
    { inicio: 16, fin: 17 },
  ],
  3: [
    { inicio: 9, fin: 10 },
    { inicio: 13, fin: 15 },
  ],
  4: [{ inicio: 11, fin: 12 }],
}
export function tomorrow(now = new Date()): string {
  const date = new Date(now)
  date.setDate(date.getDate() + 1)
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-')
}
export function isSlotAvailable(
  hora: number,
  duracion: number,
  ocupados: IntervaloDemo[],
): boolean {
  return (
    Number.isFinite(hora) &&
    Number.isFinite(duracion) &&
    hora >= 8 &&
    duracion > 0 &&
    hora + duracion <= 19 &&
    !ocupados.some((r) => hora < r.fin && hora + duracion > r.inicio)
  )
}
export function demoSlots(salaId: number, query: BusquedaHorario) {
  const ocupados = agenda[salaId] ?? []
  return Array.from({ length: 3 }, (_, i) => query.hora + i).map((hora) => ({
    hora,
    available: isSlotAvailable(hora, query.duracion, ocupados),
    inicio: query.fecha + 'T' + String(hora).padStart(2, '0') + ':00',
    fin:
      query.fecha +
      'T' +
      String(hora + query.duracion).padStart(2, '0') +
      ':00',
  }))
}
export function demoBookingCount(salaId: number) {
  return (agenda[salaId] ?? []).length
}
