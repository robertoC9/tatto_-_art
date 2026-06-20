import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import multerUpload from "./config/multers.js";

// Crea la app de Express
const app = express();

// Puerto para Render (usa PORT del entorno si existe)
const PORT = process.env.PORT || 3000;


// __dirname/__filename no existen en ESM; se obtienen con fileURLToPath
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directorio público donde están index.html, etc.
const publicDir = path.join(__dirname);


// Body parser para JSON
app.use(express.json());

// Body parser para formularios urlencoded
app.use(express.urlencoded({ extended: true }));

// Sirve estáticos desde el directorio del proyecto
app.use(express.static(publicDir));


// Endpoint para el formulario de contacto
app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body;


  // Validación básica: todos los campos son requeridos
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Es necesario enviar nombre, correo y mensaje." });
  }


  // Log del mensaje (útil para revisar que el backend recibe bien los datos)
  console.log("Nuevo mensaje de contacto:", { name, email, message });

  // Respuesta JSON para que el frontend muestre “enviado”
  return res.json({ ok: true, message: "Mensaje recibido. Gracias por contactarnos." });
});


// Endpoint para subida de imagen: multer-storage-cloudinary sube a Cloudinary
app.post("/api/upload", multerUpload.single("file"), (req, res) => {
  // multer-storage-cloudinary agrega info del upload al objeto req.file

  if (!req.file) {
    return res.status(400).json({ error: "No se recibió ningún archivo." });
  }

  // Dependiendo de la versión de multer-storage-cloudinary, la URL puede venir en distintos campos.
  // Mantenemos fallbacks para evitar “conflictos” de contrato entre dependencias.
  const secureUrl =
    req.file?.path ||
    req.file?.secure_url ||
    req.file?.secureUrl ||
    req.file?.url;


  // El frontend usa esta url para mostrar la imagen y el enlace
  return res.json({ ok: true, url: secureUrl });
});


// Fallback: cualquier ruta desconocida sirve el index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});


// Manejo de errores (middleware de Express)
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  // Respuesta JSON de error para que el frontend reciba un mensaje
  res.status(400).json({ error: err.message || "Ocurrió un error en el servidor." });
});


// Arranca el servidor
app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});


