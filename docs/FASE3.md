# Fase 3: pruebas y documentacion

Estado: implementacion preparada y backend disponible. La ejecucion completa de
Postman y la matriz manual deben registrarse antes del cierre final. Responsable:
Gerardo. Revision: Sebastian.

## Estado confirmado del backend

El repositorio `AdrianE111/ReservaLabs` incluye:

- Prisma conectado con Supabase y relacion Sala 1 a N Reserva.
- `GET /api/salas` con reservas incluidas.
- `POST /api/salas/:id/reservas` con respuestas 201, 400, 404 y 409.
- validacion de solapamientos antes de crear una reserva;
- seis salas sembradas con una URL publica `imagenUrl` por registro;
- imagenes alojadas en el bucket publico `laboratorios` de Supabase Storage;
- Express con JSON, CORS y puerto 3010 de forma predeterminada.

Las credenciales de Supabase pertenecen exclusivamente al backend. El frontend
solo utiliza `VITE_API_URL` y recibe URLs publicas de imagenes mediante la API.

## Trabajo completado

- Cliente HTTP y esquemas Zod para salas, imagenes y reservas.
- Estados de carga, vacio, error, conflicto y confirmacion del servidor.
- 21 pruebas de filtros, esquema de imagen, validacion, fechas y disponibilidad.
- Coleccion Postman v2.1 con nueve solicitudes del contrato del frontend.
- Comprobacion de URLs publicas y unicas de imagenes en el catalogo.
- Caso reproducible de conflicto `409` reutilizando el horario recien reservado.
- Matriz manual para integracion, accesibilidad, responsive y seguridad.

## Como ejecutar

Backend:

```bash
cd ../ReservaLabs
npm ci
npx prisma generate
npm run dev
```

Frontend, en otra terminal:

```bash
npm ci
cp -n .env.example .env.local
npm run check
npm run dev
```

El `.env.local` del frontend contiene solamente:

```env
VITE_API_URL=http://localhost:3010
```

Para probar el contrato, importar `postman/ReservaLabs.postman_collection.json` y
seguir `postman/README.md`. Los POST crean datos reales en la base configurada.

## Contrato verificado en codigo

| Caso                                  | Respuesta esperada                                  |
| ------------------------------------- | --------------------------------------------------- |
| `GET /api/salas`                      | 200 con salas, `imagenUrl` y reservas incluidas     |
| `POST /api/salas/:id/reservas` valido | 201 con la reserva persistida                       |
| Cuerpo o ID invalido                  | 400 con error legible y detalles cuando corresponda |
| Sala inexistente                      | 404 con mensaje legible                             |
| Horario solapado                      | 409 sin crear una segunda reserva                   |

Las fechas viajan como ISO 8601 UTC. La interfaz construye los instantes desde el
horario local del dispositivo y los serializa con `toISOString()`.

## Matriz de pruebas

`APROBADO LOCAL` indica una comprobacion automatizada ya ejecutada. `PENDIENTE`
requiere registrar una ejecucion contra el backend o una revision manual.

| ID  | Caso                                       | Resultado esperado                                 | Estado           |
| --- | ------------------------------------------ | -------------------------------------------------- | ---------------- |
| A01 | Ejecutar `npm run check`                   | Formato, lint, 21 pruebas, tipos y build aprobados | APROBADO LOCAL   |
| I01 | Cargar las seis salas sembradas            | Catalogo muestra datos e imagenes de la API        | PENDIENTE        |
| I02 | Backend devuelve arreglo vacio             | Estado vacio claro, sin error falso                | PENDIENTE        |
| I03 | Detener y reiniciar backend                | Error visible y recuperacion con Reintentar        | PENDIENTE        |
| I04 | Crear reserva valida y recargar            | Persiste y bloquea el horario reservado            | PENDIENTE        |
| I05 | Enviar formulario invalido                 | Errores visibles y ningun POST                     | PENDIENTE        |
| I06 | Backend devuelve 400, 404 o 500            | Mensaje visible y ninguna confirmacion falsa       | PENDIENTE        |
| I07 | Repetir el mismo horario                   | Un 201, luego 409 y una sola reserva               | PENDIENTE        |
| I08 | Reserva atraviesa medianoche               | Ocupa los intervalos de ambos dias                 | APROBADO LOCAL   |
| I09 | Nueva sala con ID distinto                 | Presentacion generica, sin depender del ID         | APROBADO LOCAL   |
| I10 | URL de imagen ausente o rota               | Muestra `Imagen no disponible`                     | PENDIENTE MANUAL |
| I11 | URL publica de cada sala                   | Imagen accesible sin credenciales                  | PENDIENTE        |
| A02 | Navegar con Tab, Shift+Tab, Enter y Escape | Foco visible y dialogo operable                    | PENDIENTE MANUAL |
| A03 | Provocar errores de todos los campos       | Mensajes asociados y anunciados                    | PENDIENTE MANUAL |
| V01 | 360, 768 y 1440 px; zoom 200%              | Sin controles cortados ni desborde innecesario     | PENDIENTE MANUAL |
| S01 | Revisar archivos versionados               | Sin secretos y con `.env.example`                  | PENDIENTE PR     |

## Registro de evidencia

Para cada ejecucion real anotar fecha, responsable, commits de frontend y backend,
entorno, zona horaria, caso, resultado y evidencia sin credenciales. Una compilacion
local no sustituye la prueba de integracion.

## Criterio de cierre

- [x] Fases 1, 2 y correcciones integradas en `dev`.
- [x] Backend con rutas, imagenes y conflicto 409 disponibles.
- [x] Suite local y coleccion Postman actualizadas.
- [x] `npm run check` aprobado en la rama de imagenes.
- [ ] Coleccion Postman ejecutada contra el backend real y resultados guardados.
- [ ] Matriz manual ejecutada y documentada.
- [ ] PR de imagenes revisado y fusionado hacia `dev`.
- [ ] PR final de `dev` hacia `main` acordado por ambos integrantes.

## Decision y limites

Las imagenes se administran en Supabase Storage y la base guarda sus URLs. El
frontend no conserva archivos ni mapas por ID o nombre. La coleccion automatiza el
contrato HTTP, pero Postman no verifica CORS del navegador ni sustituye las pruebas
manuales de accesibilidad y responsive.
