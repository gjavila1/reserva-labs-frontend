import assert from 'node:assert/strict'
import test from 'node:test'
import { filtrarSalas } from '../src/features/salas/salas.utils.ts'
import { validatePreview } from '../src/features/reservas/reservas.preview.ts'
import {
  demoSlots,
  isSlotAvailable,
  tomorrow,
} from '../src/features/reservas/disponibilidad.demo.ts'

const salas = [
  { id: 1, nombre: 'Electrónica', edificio: 'M', capacidad: 20 },
  { id: 2, nombre: 'Redes', edificio: 'K', capacidad: 30 },
]
const draft = {
  salaId: '1',
  responsable: 'Ana López',
  motivo: 'Práctica de redes',
  inicio: '2026-12-01T14:00',
  fin: '2026-12-01T16:00',
}

test('la búsqueda ignora tildes, mayúsculas y espacios exteriores', () => {
  assert.deepEqual(
    filtrarSalas(salas, ' ELECTRONICA ', '').map((sala) => sala.id),
    [1],
  )
})
test('combina búsqueda y edificio sin modificar el catálogo', () => {
  assert.deepEqual(filtrarSalas(salas, 'Redes', 'M'), [])
  assert.equal(filtrarSalas(salas, '', '').length, 2)
  assert.equal(salas.length, 2)
})
test('permite un catálogo vacío sin fallar', () => {
  assert.deepEqual(filtrarSalas([], 'redes', 'M'), [])
})
test('una solicitud válida se puede previsualizar', () => {
  assert.deepEqual(validatePreview(draft, [1, 2]), {})
})
test('no acepta una sala inexistente ni texto compuesto solo por espacios', () => {
  const errors = validatePreview(
    { ...draft, salaId: '99', responsable: '   ', motivo: '  ' },
    [1, 2],
  )
  assert.deepEqual(Object.keys(errors), ['salaId', 'responsable', 'motivo'])
})
test('rechaza horarios iguales o invertidos', () => {
  assert.ok(validatePreview({ ...draft, fin: draft.inicio }, [1]).fin)
  assert.ok(validatePreview({ ...draft, fin: '2026-12-01T13:00' }, [1]).fin)
})
test('identifica fechas ausentes o inválidas', () => {
  const errors = validatePreview({ ...draft, inicio: '', fin: 'invalida' }, [1])
  assert.ok(errors.inicio)
  assert.ok(errors.fin)
})

test('los horarios contiguos no se consideran superpuestos', () => {
  const ocupados = [{ inicio: 10, fin: 11 }]
  assert.equal(isSlotAvailable(9, 1, ocupados), true)
  assert.equal(isSlotAvailable(11, 1, ocupados), true)
  assert.equal(isSlotAvailable(9, 2, ocupados), false)
  assert.equal(isSlotAvailable(10, 1, ocupados), false)
})

test('la duración completa debe caber dentro de la jornada de demostración', () => {
  assert.equal(isSlotAvailable(17, 2, []), true)
  assert.equal(isSlotAvailable(17, 3, []), false)
  assert.equal(isSlotAvailable(7, 1, []), false)
  assert.equal(isSlotAvailable(9, 0, []), false)
  assert.equal(isSlotAvailable(NaN, 1, []), false)
})

test('los intervalos seleccionables conservan la fecha y duración consultadas', () => {
  const slots = demoSlots(1, {
    fecha: '2026-12-10',
    hora: 9,
    duracion: 2,
    personas: 20,
  })
  assert.deepEqual(
    slots.map((slot) => slot.available),
    [false, false, true],
  )
  assert.equal(slots[2].inicio, '2026-12-10T11:00')
  assert.equal(slots[2].fin, '2026-12-10T13:00')
})

test('mañana conserva la fecha local al cambiar de mes y año', () => {
  assert.equal(tomorrow(new Date(2026, 11, 31, 23, 30)), '2027-01-01')
  assert.equal(tomorrow(new Date(2026, 1, 28, 12)), '2026-03-01')
})
