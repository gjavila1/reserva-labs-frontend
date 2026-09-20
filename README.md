# Reserva Labs - Frontend

Base de trabajo compartida de Gerardo y Sebastian. React + Vite + TypeScript.
El backend pertenece a otro repositorio y no esta incluido.

## Estado actual

Solo esqueleto: sin pantallas, componentes de negocio, datos simulados ni llamadas API.
Al abrir el servidor se muestra una pagina vacia de forma intencional.
main y dev nacen del mismo commit inicial; el trabajo futuro se hace desde dev.

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

| Comando              | Proposito                           |
| -------------------- | ----------------------------------- |
| npm run dev          | Servidor local                      |
| npm run format       | Aplicar formato                     |
| npm run format:check | Comprobar formato                   |
| npm run lint         | ESLint, sin advertencias permitidas |
| npm run typecheck    | Comprobar TypeScript                |
| npm run build        | Comprobar tipos y compilar          |
| npm run preview      | Previsualizar build local           |
| npm run check        | Formato, lint y build con tipos     |

No hay pruebas funcionales porque aun no hay funcionalidades.

## Estructura

- src/app: composicion principal; App devuelve null durante esta etapa.
- src/features: futuras funcionalidades (salas, reservas), creadas cuando se trabajen.
- src/shared/ui: futuros componentes reutilizables.
- src/shared/api: futuro cliente HTTP compartido.
- src/shared/config: futura configuracion centralizada.
- src/styles: estilos globales minimos.

## Colaboracion

Leer CONTRIBUTING.md para el flujo completo. Los agentes deben seguir AGENTS.md.
CLAUDE.md conserva las reglas de oro solicitadas en la guia del curso.

```text
main (esqueleto hasta entrega)
  dev (integracion / preproduccion)
    feat/componente -> PR a dev
    fix/correccion  -> PR a dev
    chore/tarea     -> PR a dev
  dev -> PR final a main
```

## Publicar el repositorio cuando el equipo lo cree

Crear un repositorio vacio llamado reserva-labs-frontend, sin README generado.
Sustituir la URL del ejemplo por la real:

```sh
git remote add origin https://github.com/USUARIO/reserva-labs-frontend.git
git push -u origin main
git push -u origin dev
```

Agregar al companero como colaborador, establecer dev como predeterminada y activar
las protecciones descritas en CONTRIBUTING.md. No hay remoto ni despliegue configurados.

## Fuentes de configuracion

- [Vite](https://vite.dev/guide/)
- [Variables publicas de Vite](https://vite.dev/guide/env-and-mode)
- [Instrucciones de Codex](https://learn.chatgpt.com/docs/agent-configuration/agents-md)
- [Proteccion de ramas](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
