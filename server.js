const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./routes"); // Asegúrate de importar bien las rutas
const cors = require("cors");

const app = express();

// Middleware para JSON
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

// Cargar las rutas
app.use(routes); // Aquí se montan las rutas

// Servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
