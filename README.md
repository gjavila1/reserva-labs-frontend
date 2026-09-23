# Reserva Labs - Frontend

Base de trabajo compartida de Gerardo y Sebastian. React + Vite + TypeScript.
El backend pertenece a otro repositorio y no esta incluido.

## Estado actual

Las fases de interfaz, integracion y preparacion de pruebas estan incorporadas en
`dev`. El catalogo y las reservas usan `GET /api/salas` y
`POST /api/salas/:id/reservas`; ya no hay datos de ejemplo ni confirmaciones
locales. `main` conserva el esqueleto hasta el PR final acordado por el equipo.

Con npm run dev el catalogo, los horarios y el contador de reservas por dia vienen
del backend configurado en VITE_API_URL. Se busca por fecha, hora, duracion y
personas; se filtra por nombre y edificio. Al elegir una hora aparece el formulario;
la reserva se confirma solo cuando el servidor responde con exito, y si el horario
ya fue tomado se avisa el conflicto para elegir otro.

El backend real (`AdrianE111/ReservaLabs`) expone las rutas consumidas por el
frontend, persiste en Supabase, rechaza solapamientos con `409` y devuelve seis
salas con `imagenUrl`. Las imagenes se sirven desde Supabase Storage; si una URL
falta o falla, la tarjeta muestra `Imagen no disponible`.

## Requisitos y arranque

Node.js 24 y npm. Trabajar fuera de OneDrive.

```sh
npm ci
cp .env.example .env.local   # ajustar VITE_API_URL al backend a usar
npm run dev
```

La configuracion de la API esta en .env.example. Copiar a .env.local y ajustar
VITE_API_URL antes de levantar el proyecto; sin esa variable la app no arranca
(falla rapido con un mensaje claro). Todo VITE_ es publico; nunca incluir claves.

## Comandos

| Comando              | Proposito                                |
| -------------------- | ---------------------------------------- |
| npm run dev          | Servidor local                           |
| npm run format       | Aplicar formato                          |
| npm run format:check | Comprobar formato                        |
| npm run lint         | ESLint, sin advertencias permitidas      |
| npm run typecheck    | Comprobar TypeScript                     |
| npm run build        | Comprobar tipos y compilar               |
| npm run preview      | Previsualizar build local                |
| npm run check        | Formato, lint, pruebas y build con tipos |

`npm test` ejecuta 21 pruebas de filtros, contrato de imagenes, validacion de
reservas, fechas y solapamientos (runner nativo de Node 24).

## Estructura

- src/app: composicion, navegacion y estado de seleccion del laboratorio.
- src/features/salas: tipo Sala, filtros, tarjetas, catalogo y carga real (useSalas).
- src/features/reservas: formulario, validacion Zod y disponibilidad real.
- src/shared/ui: iconos SVG reutilizables.
- src/shared/api: cliente HTTP compartido y esquemas Zod de la respuesta del backend.
- src/shared/config: configuracion centralizada (VITE_API_URL), validada al arrancar.
- src/styles: estilos base, layout, catalogo y formulario, con reglas responsive.
- tests: casos de filtros, validacion de reservas y disponibilidad real.

Consultar `docs/FASE1.md` para el alcance inicial, `docs/FASE2.md` para la
integracion, `docs/FASE3.md` para la matriz de pruebas y `docs/IMAGENES.md` para
la gestion de imagenes.

## Colaboracion

Leer CONTRIBUTING.md para el flujo completo. Los agentes deben seguir AGENTS.md.
CLAUDE.md conserva las reglas de oro solicitadas en la guia del curso.

```text
main (esqueleto hasta entrega)
  dev (integracion / preproduccion)
    feature/fase1-interfaz -> PR a dev
    feature/fase2-integracion -> PR a dev
    feature/fase3-pruebas-documentacion -> PR a dev
    feature/imagenes-dinamicas -> PR a dev
  dev -> PR final a main
```

## Repositorio compartido

Repositorio: https://github.com/gjavila1/reserva-labs-frontend

Para una nueva copia de trabajo:

```sh
git clone https://github.com/gjavila1/reserva-labs-frontend.git
cd reserva-labs-frontend
git switch dev
npm ci
```

Las ramas de trabajo salen de dev. No fusionar cambios directamente en main.
Las protecciones descritas en CONTRIBUTING.md deben verificarse en GitHub;
los archivos locales no las activan. Esta fase no configura despliegues.

## Fuentes de configuracion

- [Vite](https://vite.dev/guide/)
- [Variables publicas de Vite](https://vite.dev/guide/env-and-mode)
- [Instrucciones de Codex](https://learn.chatgpt.com/docs/agent-configuration/agents-md)
- [Proteccion de ramas](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)

## Pruebas de integracion

La matriz y el registro de evidencia estan en `docs/FASE3.md`. La coleccion
actualizada se encuentra en `postman/ReservaLabs.postman_collection.json` y
comprueba catalogo, URLs de imagenes, creacion, persistencia, validaciones,
solapamiento `409` y sala inexistente. Los POST modifican la base configurada.
