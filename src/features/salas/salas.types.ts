/** Campos base de una sala, compartidos por los calculos de disponibilidad. */
export interface Sala {
  id: number
  nombre: string
  edificio: string
  capacidad: number
}
