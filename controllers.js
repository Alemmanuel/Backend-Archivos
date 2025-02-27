const path = require("path");

exports.uploadFile = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No se envió ningún archivo" });

  const filePath = `/uploads/${req.file.filename}`;

  try {
    const query = "INSERT INTO files (filename, path, mimetype) VALUES ($1, $2, $3) RETURNING *";
    const values = [req.file.originalname, filePath, req.file.mimetype];

    const result = await db.query(query, values);

    res.json({ message: "Archivo subido", file: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: "Error al subir archivo", error });
  }
};

exports.getFile = async (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, "..", "uploads", filename);
  res.sendFile(filePath);
};
