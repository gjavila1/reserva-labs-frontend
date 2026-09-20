import type { Sala } from './salas.types'

/** Fixtures de interfaz, disponibles solo cuando Vite está en desarrollo. */
export const salasDemo: Sala[] = [
  {
    id: 1,
    nombre: 'Laboratorio de programación',
    edificio: 'M',
    capacidad: 30,
  },
  { id: 2, nombre: 'Laboratorio de redes', edificio: 'M', capacidad: 24 },
  { id: 3, nombre: 'Laboratorio de electrónica', edificio: 'J', capacidad: 20 },
  { id: 4, nombre: 'Laboratorio de innovación', edificio: 'K', capacidad: 36 },
]
