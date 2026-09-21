import type { Sala } from './salas.types'

// Convierte un texto a minusculas y sin tildes para poder comparar
// nombres sin importar como los haya escrito la persona.
const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()

// Deja solo los laboratorios cuyo nombre o edificio coincide con la
// busqueda escrita y, si se eligio un edificio, que sean de ese edificio.
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
