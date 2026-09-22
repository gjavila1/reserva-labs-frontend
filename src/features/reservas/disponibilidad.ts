import { isSlotAvailable, tomorrow } from './disponibilidad.demo.ts'
import type {
  BusquedaHorario,
  SeleccionHorario,
} from './disponibilidad.demo.ts'
import type { SalaConReservas } from '../../shared/api/schemas'

export { tomorrow, isSlotAvailable }
export type { BusquedaHorario, SeleccionHorario }

export interface HorarioSlot {
  hora: number
  available: boolean
  inicio: string
  fin: string
}

// Compara la fecha de una reserva con la fecha que el usuario esta buscando.
function esMismaFechaLocal(fecha: Date, fechaConsultada: string): boolean {
  const [year, month, day] = fechaConsultada.split('-').map(Number)
  return (
    fecha.getFullYear() === year &&
    fecha.getMonth() + 1 === month &&
    fecha.getDate() === day
  )
}

/** Reservas reales de una sala en la fecha consultada, como horas decimales. */
function intervalosOcupados(sala: SalaConReservas, fecha: string) {
  return sala.reservas
    .filter((reserva) => esMismaFechaLocal(reserva.inicio, fecha))
    .map((reserva) => ({
      inicio: reserva.inicio.getHours() + reserva.inicio.getMinutes() / 60,
      fin: reserva.fin.getHours() + reserva.fin.getMinutes() / 60,
    }))
}

/** Igual forma que la demo de fase 1, pero calculada desde reservas reales del backend. */
export function slotsDisponibles(
  sala: SalaConReservas,
  query: BusquedaHorario,
): HorarioSlot[] {
  const ocupados = intervalosOcupados(sala, query.fecha)
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

// Cuenta cuantas reservas tiene esa sala en la fecha que se esta consultando.
export function reservasDelDia(sala: SalaConReservas, fecha: string): number {
  return intervalosOcupados(sala, fecha).length
}
