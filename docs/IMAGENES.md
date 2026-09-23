# Imágenes de laboratorios

Las imágenes de las salas se administran mediante Supabase Storage. Cada registro
de `Sala` contiene una URL pública opcional en `imagenUrl`, que el backend devuelve
mediante `GET /api/salas`.

El frontend no relaciona imágenes con IDs o nombres y no conserva copias locales.
Si `imagenUrl` falta o el recurso no puede cargarse, la tarjeta muestra “Imagen no
disponible” sin presentar la fotografía de otra sala como reemplazo.

Las imágenes ilustrativas generadas durante la fase 1 se retiraron del repositorio
después de migrarlas al almacenamiento administrado por el equipo. No representan
instalaciones reales del campus.

Para agregar o reemplazar una imagen:

1. Subir el archivo al bucket público `laboratorios` de Supabase Storage.
2. Guardar su URL pública completa en el campo `Sala.imagenUrl`.
3. Comprobar que la URL abra sin autenticación y recargar el catálogo.

No es necesario modificar ni volver a compilar el frontend.
