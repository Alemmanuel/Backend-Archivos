const express = require("express");
const { uploadFile, handleUpload } = require("./uploadControllers");

const router = express.Router();

// Ruta para subir archivos
router.post("/api/upload", uploadFile, handleUpload);

module.exports = router;
