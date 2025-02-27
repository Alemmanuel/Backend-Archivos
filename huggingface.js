const axios = require("axios");
const fs = require("fs");
require("dotenv").config();

const hfToken = process.env.HUGGINGFACE_API_TOKEN;
if (!hfToken) {
  console.error();
  process.exit(1);
}

const modelURL = "https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-base";

async function getImageCaption(imagePath) {
  try {
    const imageData = fs.readFileSync(imagePath);
    console.log(`📡 Enviando imagen ${imagePath} a Hugging Face con modelo BLIP...`);
    
    const response = await axios.post(
      modelURL,
      imageData,
      {
        headers: {
          "Authorization": `Bearer ${hfToken}`,
          "Content-Type": "application/octet-stream"
        }
      }
    );

    const result = response.data;
    console.log("✅ Respuesta de Hugging Face:", result);
    // La respuesta suele ser un array de objetos con la propiedad "generated_text"
    if (Array.isArray(result) && result.length > 0 && result[0].generated_text) {
      return result[0].generated_text;
    }
    return "No se pudo generar una descripción";
  } catch (error) {
    console.error("❌ Error al llamar la API de Hugging Face:", error.response ? error.response.data : error.message);
    return null;
  }
}

module.exports = { getImageCaption };
