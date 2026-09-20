# Reserva Labs - Frontend

Base de trabajo compartida de Gerardo y Sebastian. React + Vite + TypeScript.
El backend pertenece a otro repositorio y no esta incluido.

## Estado actual

Fase 1: interfaz de laboratorios y formulario de vista previa, sin llamadas API ni
persistencia. main conserva el esqueleto; esta fase se revisa mediante PR hacia dev.

Con npm run dev hay cuatro laboratorios de demostracion con imagenes y horarios.
Se busca por fecha, hora, duracion y personas; se filtra por nombre y edificio.
Al elegir una hora aparece el formulario. Revisar mi solicitud muestra una vista
previa con feedback visual, sin enviar ni guardar reservas.

Con npm run build y npm run preview no se muestra el catalogo ficticio: aparece el
estado vacio hasta integrar la API en fase 2. Las imagenes ilustrativas se conservan
en public/images; su origen y prompts estan en docs/IMAGENES.md.

## Requisitos y arranque

Node.js 24 y npm. Trabajar fuera de OneDrive.

```sh
npm ci
npm run dev
```

La configuracion futura de la API esta documentada en .env.example. Cuando se necesite,
copiar a .env.local y ajustar VITE_API_URL. Todo VITE_ es publico; nunca incluir claves.
Actualmente la aplicacion no consume esa variable ni necesita un backend para arrancar.

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

Ejecutar npm test para las once pruebas de filtros, vista previa y solapamiento
de horarios de demostracion (runner nativo de Node 24, sin dependencias nuevas).

## Estructura

- src/app: composicion, navegacion y estado de seleccion del laboratorio.
- src/features/salas: tipo Sala, fixtures, filtros, tarjetas y catalogo.
- src/features/reservas: formulario, tipos, validacion y agenda de demostracion.
- src/shared/ui: iconos SVG reutilizables.
- src/shared/api: futuro cliente HTTP compartido.
- src/shared/config: futura configuracion centralizada.
- src/styles: estilos base, layout, catalogo y formulario, con reglas responsive.
- tests: casos de filtros, sala invalida, texto vacio y rango de fechas.

Consultar docs/FASE1.md para el alcance y las comprobaciones de esta entrega.

## Colaboracion

Leer CONTRIBUTING.md para el flujo completo. Los agentes deben seguir AGENTS.md.
CLAUDE.md conserva las reglas de oro solicitadas en la guia del curso.

```text
main (esqueleto hasta entrega)
  dev (integracion / preproduccion)
    feature/fase1-interfaz -> PR a dev
    feature/fase2-integracion -> PR a dev
    feature/fase3-pruebas-documentacion -> PR a dev
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
