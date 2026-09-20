import type { Sala } from './salas.types'

const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()

export function filtrarSalas(
  salas: Sala[],
  busqueda: string,
  edificio: string,
): Sala[] {
  const query = normalize(busqueda)
  return salas.filter(
    (sala) =>
      (!edificio || sala.edificio === edificio) &&
      normalize(`${sala.nombre} ${sala.edificio}`).includes(query),
  )
}
