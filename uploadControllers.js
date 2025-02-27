const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { getImageCaption } = require("./huggingface");

const UPLOAD_DIR = "uploads";

// Asegurarse de que la carpeta "uploads" exista
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  console.log(`📂 Carpeta '${UPLOAD_DIR}' creada`);
} else {
  console.log(`📂 Usando carpeta existente '${UPLOAD_DIR}'`);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    const allowedExtensions = [".png", ".jpg", ".jpeg", ".gif", ".webp"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      return cb(new Error("Solo se permiten imágenes PNG, JPG, JPEG, GIF o WEBP"));
    }
    cb(null, true);
  },
});

exports.uploadFile = (req, res, next) => {
  upload.single("file")(req, res, (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ message: "El archivo no debe pesar más de 2MB" });
      }
      return res.status(400).json({ message: err.message });
    }
    next();
  });
};

exports.handleUpload = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No se envió ningún archivo" });
  }

  const filePath = req.file.path;

  try {
    // Llamar a Hugging Face para obtener la descripción de la imagen
    const captionResult = await getImageCaption(filePath);

    res.json({
      message: "Archivo subido y analizado",
      filename: req.file.filename,
      path: filePath,
      caption: captionResult || "No se pudo generar una descripción",
    });
  } catch (error) {
    res.status(500).json({ message: "Error al analizar la imagen", error: error.message });
  }
};
