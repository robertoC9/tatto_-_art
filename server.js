const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const app = express();
const PORT = process.env.PORT || 3000;
const publicDir = path.join(__dirname);
const uploadDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(uploadDir));
app.use(express.static(publicDir));

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const safeName = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9_.-]/g, "-")}`;
    cb(null, safeName);
  },
});

const fileFilter = (req, file, cb) => {
  if (/^image\/(jpeg|png|gif|webp|bmp|svg\+xml)$/.test(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten imágenes."), false);
  }
};

const upload = multer({ storage, fileFilter });

app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Es necesario enviar nombre, correo y mensaje." });
  }

  console.log("Nuevo mensaje de contacto:", { name, email, message });

  return res.json({ ok: true, message: "Mensaje recibido. Gracias por contactarnos." });
});

app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No se recibió ningún archivo." });
  }

  return res.json({ ok: true, url: `/uploads/${req.file.filename}` });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  res.status(400).json({ error: err.message || "Ocurrió un error en el servidor." });
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
