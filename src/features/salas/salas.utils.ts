import type { Sala } from './salas.types'

const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()

export function filtrarSalas<T extends Sala>(
  salas: T[],
  busqueda: string,
  edificio: string,
): T[] {
  const query = normalize(busqueda)
  return salas.filter(
    (sala) =>
      (!edificio || sala.edificio === edificio) &&
      normalize(`${sala.nombre} ${sala.edificio}`).includes(query),
  )
}
