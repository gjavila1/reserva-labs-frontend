import assert from 'node:assert/strict'
import test from 'node:test'
import { filtrarSalas } from '../src/features/salas/salas.utils.ts'
import {
  isSlotAvailable,
  tomorrow,
} from '../src/features/reservas/disponibilidad.demo.ts'

test('el filtro conserva salas nuevas y edificios no predefinidos', () => {
  const sala = { id: 97, nombre: 'Robotica', edificio: 'Z', capacidad: 45 }
  assert.deepEqual(filtrarSalas([sala], 'robotica', 'Z'), [sala])
})

test('una reserva contenida o que contiene la seleccion bloquea el horario', () => {
  assert.equal(isSlotAvailable(10, 1, [{ inicio: 9, fin: 12 }]), false)
  assert.equal(isSlotAvailable(9, 3, [{ inicio: 10, fin: 11 }]), false)
})

test('un solapamiento de minutos bloquea y un limite contiguo queda libre', () => {
  assert.equal(isSlotAvailable(9, 1, [{ inicio: 9.5, fin: 10.5 }]), false)
  assert.equal(isSlotAvailable(9, 1, [{ inicio: 10, fin: 10.5 }]), true)
})

test('las duraciones invalidas no generan disponibilidad', () => {
  for (const duracion of [-1, 0, NaN, Infinity]) {
    assert.equal(isSlotAvailable(9, duracion, []), false)
  }
})

test('manana contempla febrero de un ano bisiesto', () => {
  assert.equal(tomorrow(new Date(2028, 1, 28, 12)), '2028-02-29')
  assert.equal(tomorrow(new Date(2028, 1, 29, 12)), '2028-03-01')
})
