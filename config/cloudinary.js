import { v2 as cloudinary } from "cloudinary";

// Cloudinary se configura usando variables de entorno en Render.
// Debes definir en Render:
// - CLOUDINARY_CLOUD_NAME
// - CLOUDINARY_API_KEY
// - CLOUDINARY_API_SECRET
const requiredEnv = [
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];

const missing = requiredEnv.filter((k) => !process.env[k]);

if (missing.length) {
  // Fail fast para que Render muestre claramente por qué no funciona el upload.
  throw new Error(
    `Faltan variables de Cloudinary en el entorno: ${missing.join(", ")}`
  );
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;


