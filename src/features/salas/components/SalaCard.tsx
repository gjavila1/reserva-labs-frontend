import { Icon } from '../../../shared/ui/Icon'
import type { Sala } from '../salas.types'
import {
  demoSlots,
  demoBookingCount,
  type BusquedaHorario,
  type SeleccionHorario,
} from '../../reservas/disponibilidad.demo'

const presentation: Record<
  number,
  { image: string; category: string; description: string }
> = {
  1: {
    image: 'programacion',
    category: 'CÓMPUTO',
    description: 'Código, proyectos y nuevas ideas.',
  },
  2: {
    image: 'redes',
    category: 'CONECTIVIDAD',
    description: 'El espacio para conectar lo que aprendés.',
  },
  3: {
    image: 'electronica',
    category: 'EXPERIMENTACIÓN',
    description: 'De la teoría a tu próximo prototipo.',
  },
  4: {
    image: 'innovacion',
    category: 'COLABORACIÓN',
    description: 'Un lugar para crear en equipo.',
  },
}
export function SalaCard({
  sala,
  query,
  onSelect,
}: {
  sala: Sala
  query: BusquedaHorario
  onSelect: (selection: SeleccionHorario) => void
}) {
  const detail = presentation[sala.id]
  const slots = demoSlots(sala.id, query)
  const available = slots.some((slot) => slot.available)
  return (
    <li className="lab-card" role="listitem">
      <div className="lab-photo">
        {detail && (
          <img
            src={import.meta.env.BASE_URL + 'images/' + detail.image + '.png'}
            alt={'Imagen ilustrativa: ' + sala.nombre}
            width="1536"
            height="1024"
            loading="lazy"
          />
        )}
        <span className="location-tag">Edificio {sala.edificio}</span>
      </div>
      <div className="lab-content">
        <p className="lab-category">{detail?.category ?? 'LABORATORIO'}</p>
        <h3>{sala.nombre}</h3>
        <p className="lab-description">{detail?.description}</p>
        <p className="lab-meta">
          <Icon name="people" size={16} /> Hasta {sala.capacidad} personas{' '}
          <span>·</span> Edificio {sala.edificio}
        </p>
        <p className="lab-bookings">
          <Icon name="calendar" size={15} /> {demoBookingCount(sala.id)}{' '}
          {demoBookingCount(sala.id) === 1 ? 'reserva' : 'reservas'} de ejemplo
          este día
        </p>
        <div className="lab-availability">
          <span className={available ? 'available' : 'unavailable'}>
            <i /> {available ? 'Elegí un horario' : 'Sin cupo en estas horas'}
          </span>
          <span>{query.duracion} h</span>
        </div>
        <div className="slot-list">
          {slots.map((slot) => (
            <button
              key={slot.hora}
              type="button"
              disabled={!slot.available}
              aria-label={
                sala.nombre +
                ', ' +
                String(slot.hora).padStart(2, '0') +
                ':00' +
                (slot.available
                  ? ', elegir horario de ejemplo'
                  : ', no disponible')
              }
              onClick={() =>
                onSelect({ sala, inicio: slot.inicio, fin: slot.fin })
              }
            >
              {String(slot.hora).padStart(2, '0')}:00
            </button>
          ))}
        </div>
      </div>
    </li>
  )
}
