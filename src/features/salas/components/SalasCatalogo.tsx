import { useState } from 'react'
import { Icon } from '../../../shared/ui/Icon'
import type { Sala } from '../salas.types'
import { filtrarSalas } from '../salas.utils'
import { SalaCard } from './SalaCard'
import type {
  BusquedaHorario,
  SeleccionHorario,
} from '../../reservas/disponibilidad.demo'

export function SalasCatalogo({
  salas,
  query,
  onSelect,
}: {
  salas: Sala[]
  query: BusquedaHorario
  onSelect: (selection: SeleccionHorario) => void
}) {
  const [busqueda, setBusqueda] = useState('')
  const [edificio, setEdificio] = useState('')
  const edificios = [...new Set(salas.map((sala) => sala.edificio))].sort()
  const filtered = filtrarSalas(salas, busqueda, edificio).filter(
    (sala) => sala.capacidad >= query.personas,
  )
  const clear = () => {
    setBusqueda('')
    setEdificio('')
  }
  const dateLabel = new Intl.DateTimeFormat('es-GT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date(query.fecha + 'T12:00'))
  return (
    <section
      className="catalog"
      id="laboratorios"
      aria-labelledby="catalog-title"
    >
      <div className="section-title">
        <div>
          <h2 id="catalog-title">Un buen lugar para empezar</h2>
          <p role="status">
            {filtered.length}{' '}
            {filtered.length === 1 ? 'laboratorio' : 'laboratorios'} para{' '}
            {query.personas} {query.personas === 1 ? 'persona' : 'personas'} ·{' '}
            {dateLabel} · {query.duracion}{' '}
            {query.duracion === 1 ? 'hora' : 'horas'}
          </p>
        </div>
        <span className="availability-key">
          <i /> Horarios de demostración
        </span>
      </div>
      <div className="catalog-filters">
        <div
          className="building-tabs"
          role="group"
          aria-label="Filtrar por edificio"
        >
          {['', ...edificios].map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={edificio === item}
              onClick={() => setEdificio(item)}
            >
              {item ? 'Edificio ' + item : 'Todos los espacios'}
            </button>
          ))}
        </div>
        <label className="search-field">
          <Icon name="search" size={17} />
          <span className="sr-only">Buscar laboratorio</span>
          <input
            type="search"
            placeholder="Buscar por nombre"
            value={busqueda}
            onChange={(event) => setBusqueda(event.target.value)}
          />
        </label>
      </div>
      {filtered.length ? (
        <ul className="lab-grid" role="list">
          {filtered.map((sala) => (
            <SalaCard
              key={sala.id}
              sala={sala}
              query={query}
              onSelect={onSelect}
            />
          ))}
        </ul>
      ) : (
        <div className="empty-state">
          <Icon name="search" size={28} />
          <h3>
            {salas.length
              ? 'No encontramos espacios con estos filtros'
              : 'Estamos preparando el catálogo'}
          </h3>
          <p>
            {salas.length
              ? 'Probá con menos personas, otro nombre o un edificio diferente.'
              : 'Los laboratorios aparecerán al conectar la información del campus.'}
          </p>
          {(busqueda || edificio) && (
            <button
              type="button"
              className="button button-outline"
              onClick={clear}
            >
              Limpiar nombre y edificio
            </button>
          )}
        </div>
      )}
      <p className="catalog-footnote">
        <Icon name="info" size={15} /> Las horas tachadas están ocupadas o fuera
        del horario de esta demo. Horario local del dispositivo.
      </p>
    </section>
  )
}
