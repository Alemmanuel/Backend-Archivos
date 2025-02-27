const axios = require("axios")

// Asegúrate de reemplazar 'TU_API_KEY_DE_DEEPSEEK' con tu clave real
const DEEPSEEK_API_KEY = "TU_API_KEY_DE_DEEPSEEK"
const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/translate"

async function translateToSpanish(text) {
  try {
    const response = await axios.post(
      DEEPSEEK_API_URL,
      {
        text: text,
        source_lang: "en",
        target_lang: "es",
      },
      {
        headers: {
          Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    )

    return response.data.translated_text
  } catch (error) {
    console.error("Error al traducir:", error.message)
    return null
  }
}

module.exports = { translateToSpanish }

