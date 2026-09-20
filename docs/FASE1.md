# Fase 1 — Interfaz de reservas

Responsable: Gerardo. Revision: Sebastian. Rama: feature/fase1-interfaz.

## Experiencia incluida

- Busqueda por fecha, hora inicial, duracion y cantidad de personas.
- Catalogo de tarjetas con imagen ilustrativa, nombre, edificio, capacidad y horarios.
- Busqueda insensible a tildes y mayusculas, filtro por edificio y estado vacio.
- Horarios seleccionables y horas ocupadas deshabilitadas.
- Formulario en dialogo nativo al elegir una hora; sala y fechas ya seleccionadas.
- Validacion accesible, foco en primer error, resumen con feedback visual y edicion.
- Cierre con Escape y retorno del foco al horario elegido.
- Cuatro, dos o una columna segun el ancho disponible; objetivos tactiles y foco visible.
- Once pruebas unitarias incluidas en npm run check.

## Disponibilidad de demostracion

No hay API, localStorage, autenticacion ni reservas persistidas.
El catalogo solo se muestra en desarrollo mediante import.meta.env.DEV.
La compilacion de produccion muestra un catalogo vacio.

disponibilidad.demo.ts contiene una agenda ficticia que se repite cada dia.
Se consultan tres posibles horas de inicio desde la hora elegida. La duracion
completa debe caber entre 08:00 y 19:00 sin solaparse con los intervalos ficticios.
Los intervalos contiguos no se solapan. El contador muestra reservas de ejemplo
para el dia, no reservas reales ni un contador de demanda.

La fecha minima de esta demo es manana para evitar sugerir horas ya pasadas.
El formulario prepara una vista previa; no confirma ni bloquea ningun horario.
Al cerrar se descartan los datos; Editar mis datos conserva el borrador mientras
el dialogo sigue abierto. No existe una promesa de disponibilidad real.

## Validacion y contrato pendiente

Se conserva validatePreview: sala valida, responsable y motivo de tres caracteres
tras trim, fechas validas y fin posterior a inicio. Las fechas proceden del horario
seleccionado. Fase 2 debe validar con Zod y acordar contrato y zona horaria con backend.
Las fechas actuales son locales al dispositivo; no se serializan ni transmiten.

Sebastian debera sustituir fixtures y calculo de agenda por respuestas reales;
comprobar disponibilidad nuevamente al enviar, tratar conflictos y errores,
evitar envios duplicados y mostrar confirmacion solo despues del exito del servidor.
No convertir un estado local en confirmacion real.

## Revision reproducible

1. npm ci --include=dev y npm run check.
2. npm run dev: seleccionar 35 personas y buscar; solo Innovacion tiene capacidad.
3. Cambiar a 20, buscar electronica y filtrar por M: se muestra el estado vacio.
4. Limpiar filtros; Programacion a las 09:00 dura una hora, las 10:00 estan ocupadas.
5. Cambiar a dos horas: Programacion 09:00 queda deshabilitado por solapamiento.
6. Elegir un horario habilitado y revisar sin datos: error y foco en responsable.
7. Completar responsable y motivo; revisar resumen, editar y cerrar con Escape.
8. Revisar 320, 390, 820 y 1280 pixeles y teclado.
9. npm run build y npm run preview: catalogo vacio, sin reservas reales.

## Direccion visual

Referencia: [OpenTable](https://www.opentable.com/metro/seattle-restaurants).
Se toma el patron de busqueda temporal, fotografia de cada recurso y horarios
directamente seleccionables. No se copian valoraciones, precios ni marcas.
Base clara, texto oscuro y acento rojo para acciones; tarjetas solo para espacios.
El formulario aparece despues de seleccionar horario.

Las fotografias son generadas e ilustrativas, no corresponden al campus real.
Ver [IMAGENES.md](IMAGENES.md) para los archivos y prompts.
