# TODO - Fix upload error (Render + Cloudinary)

## Plan de implementación
- [x] 1) Editar `server.js` para agregar logging completo del error en `/api/upload` (req.file y estructura devuelta por CloudinaryStorage).

- [x] 2) Hacer que si no existe URL en la respuesta del storage, se devuelva un error claro (y status 500) en vez de retornar `url: undefined`.

- [x] 3) Editar `config/cloudinary.js` para validar env vars al arrancar (si faltan `CLOUDINARY_*`, lanzar error con mensaje legible).

- [x] 4) (Opcional) Ajustar `config/multers.js` para incluir `resource_type: "image"`.

- [ ] 5) Re-deploy en Render y prueba de subida.

## Progreso
- [x] Pendiente de confirmación/ejecución.


