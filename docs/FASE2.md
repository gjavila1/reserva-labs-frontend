# Fase 2 — Integración con el backend

Responsable: Sebastián. Revisión: Gerardo. Rama: feature/fase2-integracion.

## Estado del backend real al iniciar esta fase

El repositorio del backend (AdrianE111/ReservaLabs) solo tenía completada la Fase 0
(setup y variables de entorno) al momento de esta integración: sin rutas, sin
`schema.prisma` y sin controladores. No fue posible acordar en vivo con el equipo
de backend ni probar contra un servidor real.

Para no bloquear la fase, esta integración se construyó contra el contrato
documentado en la guía del curso (Fases 1 a 3 del backend) y se verificó con un
servidor de referencia local (no versionado, fuera de este repositorio) que
implementa ese mismo contrato con datos en memoria. Antes de fusionar a `dev`
hay que confirmar con Adrián los puntos marcados como **pendiente** abajo.

## Contrato asumido

- `GET /api/salas` devuelve un arreglo de salas, cada una con su arreglo
  `reservas` incluido (`prisma include: { reservas: true }`), sin paginado.
- `POST /api/salas/:id/reservas` recibe `{ responsable, motivo, inicio, fin }`
  y responde `201` con la reserva creada, `400` con
  `{ error, detalles }` (mismo formato que `parsed.error.flatten().fieldErrors`)
  si la validación falla, y `404` si la sala no existe.
- Los campos `inicio` y `fin` viajan como texto ISO 8601 y el backend los
  interpreta como fecha/hora, igual que en `disponibilidad.demo.ts` de fase 1.
- **Pendiente de confirmar con backend:** zona horaria. Por ahora el cliente
  envía `Date.toISOString()` (UTC) tal como lo arma `new Date(valor-local)`
  del navegador; no se aplicó ninguna conversión adicional. Si el backend
  espera hora local de Guatemala sin offset, hay que ajustar el cliente.
- **Pendiente de confirmar con backend:** el código `409 Conflict` cuando el
  horario solicitado se solapa con una reserva existente. La guía del curso
  lista la validación de solapamiento como "reto extra", no como parte del
  contrato base. El formulario de esta fase ya maneja ese conflicto en la UI
  (ver más abajo), pero el backend real debe implementarlo para que funcione
  en producción; mientras tanto, dos reservas podrían solaparse sin aviso.

## Cliente HTTP y configuración

- `src/shared/config/env.ts` valida `VITE_API_URL` con Zod al arrancar la app
  y falla rápido con un mensaje claro si falta.
- `src/shared/api/http.ts` centraliza `fetch`, arma la URL, serializa el
  cuerpo y traduce cualquier respuesta no exitosa a `ApiError` (con `status` y
  `detalles`). Ningún componente llama a `fetch` directamente.
- `src/shared/api/schemas.ts` y `src/shared/api/salas.ts` validan con Zod la
  forma de la respuesta del servidor antes de usarla en la interfaz.
- Copiar `.env.example` a `.env.local` y ajustar `VITE_API_URL` para apuntar
  al backend que se esté usando localmente.

## Disponibilidad y formulario reales

- `src/features/reservas/disponibilidad.ts` calcula los horarios visibles y el
  contador de reservas del día a partir de las reservas reales devueltas por
  la API, reutilizando `isSlotAvailable` de fase 1. Reemplaza la agenda
  ficticia en el catálogo (`disponibilidad.demo.ts` se conserva solo para las
  pruebas existentes de fase 1).
- `src/features/reservas/reservas.schema.ts` valida con Zod las mismas reglas
  que el backend documentado: responsable y motivo de al menos 3 caracteres,
  fin posterior a inicio, inicio en el futuro.
- `ReservaForm` deshabilita el botón de envío mientras la petición está en
  curso (evita envíos duplicados), conserva los datos del formulario si el
  envío falla y muestra el error con opción de reintentar sin perder lo
  escrito.
- La confirmación de reserva solo se muestra cuando el servidor responde
  `201`; nunca se marca como confirmada por estado local.
- Si el servidor responde `409`, se muestra el conflicto y un botón para
  elegir otro horario, que cierra el diálogo y refresca el catálogo.
- Al confirmar una reserva, `App` vuelve a pedir `GET /api/salas` para que la
  disponibilidad y el contador de la sala queden al día.
- El catálogo muestra estados de carga y de error de red (con reintento
  manual) mientras `GET /api/salas` está en curso o falla.

## Pruebas

`npm test` agrega casos para `validateReservaForm` (reemplaza a la antigua
`validatePreview`, incluida la regla de no reservar en el pasado) y para
`slotsDisponibles` / `reservasDelDia` con reservas reales de más de un día.
Las pruebas de fase 1 sobre `filtrarSalas`, `isSlotAvailable`, `demoSlots` y
`tomorrow` se mantienen sin cambios.

## Revisión reproducible

1. `npm ci` y `npm run check`.
2. Levantar un servidor que implemente el contrato de arriba en
   `http://localhost:3010` (o ajustar `VITE_API_URL` en `.env.local`).
3. `npm run dev`: el catálogo carga salas reales; si el servidor no responde,
   aparece el aviso de error con botón "Reintentar".
4. Elegir un horario disponible, completar el formulario y confirmar: la
   confirmación solo aparece tras la respuesta `201` del servidor, y el
   contador/disponibilidad de esa sala se actualizan.
5. Repetir el paso anterior pero crear, desde otra pestaña o con `curl`, una
   reserva que se solape con el horario elegido antes de enviar el
   formulario: debe aparecer el aviso de conflicto con la opción de elegir
   otro horario.
6. Enviar el formulario vacío: debe bloquear el envío sin llamar al servidor
   y enfocar el primer campo con error.
7. Detener el servidor y recargar la página: debe verse el estado de error
   con reintento; al reiniciar el servidor, "Reintentar" recupera el
   catálogo.

## Para la fase 3

- Confirmar con Adrián zona horaria y el código `409` de solapamiento antes de
  dar por cerrado el contrato.
- Cuando el backend real esté disponible, solo debería hacer falta ajustar
  `VITE_API_URL`; si los nombres de campos o el formato de error difieren,
  ajustar `src/shared/api/schemas.ts` y `src/shared/api/http.ts`.
- Falta probar contra Postman/el backend real, no solo contra el servidor de
  referencia local usado en esta fase.
