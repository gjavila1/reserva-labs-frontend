# Fase 3: pruebas y documentacion

Estado: preparada parcialmente. La integracion real sigue pendiente hasta que el
backend exponga y ejecute sus rutas. Responsable: Gerardo. Revision: Sebastian.

## Estado recibido del backend

El equipo confirmo que ya cuenta con:

- Prisma conectado con Supabase.
- Relacion Sala 1 a N Reserva con borrado en cascada.
- Tres salas sembradas: Lab A Redes, Lab B Software y Lab C Hardware.
- Validacion Zod de variables de entorno, salas, reservas e IDs.
- Controladores para crear salas y reservas con respuestas 201, 400 y 404.
- Express con `express.json()`, CORS y puerto 3010.

Todavia se debe comprobar que `GET /api/salas` este implementado, registrado en
Express y devuelva las reservas incluidas. Tampoco se ha confirmado el contrato de
zona horaria ni el codigo 409 por solapamiento.

Las credenciales de Supabase son responsabilidad exclusiva del backend. El frontend
solo usa `VITE_API_URL` y nunca debe recibir ni versionar claves de la base.

## Trabajo completado localmente

- Pruebas de filtros, validacion, limites de horario y cambio de fechas.
- Regresion para reservas que atraviesan medianoche.
- Coleccion Postman v2.1 con ocho solicitudes del contrato usado por el frontend.
- Matriz manual para integracion, accesibilidad, responsive y seguridad.
- Correcciones de fase 2: fechas completas, presentacion independiente del ID y
  errores visibles de sala/inicio/fin.

## Como ejecutar

```bash
npm ci
npm run check
cp -n .env.example .env.local
npm run dev
```

El `.env.local` del frontend debe contener solamente una URL publica:

```env
VITE_API_URL=http://localhost:3010
```

Para probar el contrato, importar `postman/ReservaLabs.postman_collection.json` y
seguir `postman/README.md`. Los POST solo deben ejecutarse contra una base autorizada
para pruebas.

## Contrato que debe confirmar backend

| Caso                                    | Respuesta esperada                                             |
| --------------------------------------- | -------------------------------------------------------------- |
| `GET /api/salas`                        | 200 con arreglo de salas y `reservas: []` o reservas incluidas |
| `POST /api/salas/:id/reservas` valido   | 201 con `id`, `salaId`, responsable, motivo, inicio y fin      |
| Cuerpo o ID invalido                    | 400 con `error` y `detalles` por campo                         |
| Sala inexistente                        | 404 con mensaje legible                                        |
| Horario solapado, si se adopta el extra | 409 sin crear una segunda reserva                              |

Las fechas deben viajar como ISO 8601. Falta acordar si el horario del campus se
almacena en UTC y como se presenta en `America/Guatemala`.

## Matriz de pruebas

Los casos marcados PENDIENTE requieren el backend real.

| ID  | Caso                                       | Resultado esperado                                  | Estado           |
| --- | ------------------------------------------ | --------------------------------------------------- | ---------------- |
| A01 | Ejecutar `npm run check`                   | Formato, lint, pruebas, tipos y build aprobados     | APROBADO LOCAL   |
| I01 | Cargar las tres salas sembradas            | Catalogo muestra A, B y C con datos reales          | PENDIENTE        |
| I02 | Backend devuelve arreglo vacio             | Estado vacio claro, sin error falso                 | PENDIENTE        |
| I03 | Detener y reiniciar backend                | Error visible y recuperacion con Reintentar         | PENDIENTE        |
| I04 | Crear reserva valida y recargar            | Persiste y bloquea el horario reservado             | PENDIENTE        |
| I05 | Enviar formulario invalido                 | Errores visibles y ningun POST                      | PENDIENTE        |
| I06 | Backend devuelve 400, 404 o 500            | Mensaje visible y ninguna confirmacion falsa        | PENDIENTE        |
| I07 | Dos clientes reservan el mismo horario     | Si hay extra: un 201, un 409 y una reserva          | PENDIENTE        |
| I08 | Reserva atraviesa medianoche               | Ocupa los intervalos de ambos dias                  | APROBADO LOCAL   |
| I09 | Nueva sala con ID distinto                 | Presentacion generica correcta, sin depender del ID | APROBADO LOCAL   |
| I10 | Falla recarga despues de un POST exitoso   | No invita a repetir una reserva ya creada           | PENDIENTE        |
| A02 | Navegar con Tab, Shift+Tab, Enter y Escape | Foco visible y dialogo operable                     | PENDIENTE MANUAL |
| A03 | Provocar errores de todos los campos       | Mensajes asociados y anunciados                     | PENDIENTE MANUAL |
| V01 | 360, 768 y 1440 px; zoom 200%              | Sin controles cortados ni desborde innecesario      | PENDIENTE MANUAL |
| S01 | Revisar archivos versionados               | Sin `.env` ni secretos; `.env.example` presente     | PENDIENTE PR     |

## Registro de evidencia

Para cada ejecución real anotar:

- fecha y responsable;
- commit del frontend y backend;
- entorno y zona horaria;
- ID del caso;
- resultado observado y esperado;
- evidencia sin credenciales ni datos sensibles.

Una compilacion o una simulacion local no demuestra que el backend real funciona.

## Criterio de cierre

- [x] Fase 2 y sus correcciones integradas en la base de trabajo.
- [x] Suite local y coleccion Postman preparadas.
- [ ] `GET /api/salas` y rutas confirmadas con backend.
- [ ] Contrato de fechas y zona horaria acordado.
- [ ] `npm run check` aprobado en el commit final.
- [ ] Coleccion Postman ejecutada contra backend real.
- [ ] Matriz manual ejecutada y documentada.
- [ ] PR de fase 3 revisado y fusionado hacia `dev`.

## Plan, Work, Review y Compound

Decision principal: preparar pruebas reproducibles sin declarar aprobada una
integracion que todavia no puede ejecutarse. Se descarto copiar credenciales de la
base al frontend. La mayor incertidumbre sigue siendo el contrato real de rutas,
fechas y conflictos del backend.
