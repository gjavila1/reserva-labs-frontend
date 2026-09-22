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

function fechaHoraLocal(fecha: string, hora = 0): Date {
  const [year, month, day] = fecha.split('-').map(Number)
  return new Date(year, month - 1, day, hora)
}

function seSolapan(
  inicioA: Date,
  finA: Date,
  inicioB: Date,
  finB: Date,
): boolean {
  return inicioA < finB && finA > inicioB
}

/** Igual forma que la demo de fase 1, pero calculada desde reservas reales del backend. */
export function slotsDisponibles(
  sala: SalaConReservas,
  query: BusquedaHorario,
): HorarioSlot[] {
  return Array.from({ length: 3 }, (_, i) => query.hora + i).map((hora) => {
    const inicio = fechaHoraLocal(query.fecha, hora)
    const fin = new Date(inicio.getTime() + query.duracion * 60 * 60 * 1000)
    const dentroDeJornada = isSlotAvailable(hora, query.duracion, [])
    const ocupada = sala.reservas.some((reserva) =>
      seSolapan(inicio, fin, reserva.inicio, reserva.fin),
    )

    return {
      hora,
      available: dentroDeJornada && !ocupada,
      inicio: query.fecha + 'T' + String(hora).padStart(2, '0') + ':00',
      fin:
        query.fecha +
        'T' +
        String(hora + query.duracion).padStart(2, '0') +
        ':00',
    }
  })
}

// Cuenta cuantas reservas tiene esa sala en la fecha que se esta consultando.
export function reservasDelDia(sala: SalaConReservas, fecha: string): number {
  const inicioDia = fechaHoraLocal(fecha)
  const finDia = new Date(inicioDia)
  finDia.setDate(finDia.getDate() + 1)
  return sala.reservas.filter((reserva) =>
    seSolapan(inicioDia, finDia, reserva.inicio, reserva.fin),
  ).length
}
