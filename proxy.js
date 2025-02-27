const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware para configurar los encabezados CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Ruta para manejar solicitudes a la API de Hugging Face
app.post('/proxy/huggingface', async (req, res) => {
  try {
    const response = await axios.post('https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-base', req.body, {
      headers: {
        'Authorization': `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`,
        'Content-Type': 'application/octet-stream'
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Ruta para manejar solicitudes a la API de Deepseek
app.post('/proxy/deepseek', async (req, res) => {
  try {
    const { text, target_lang } = req.body;
    const response = await axios.post('https://api.deepseek.com', {
      text,
      target_lang
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
