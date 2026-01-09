// Configuration Constants
const KOLOSAL_API_URL = "https://api.kolosal.ai/v1/chat/completions";
const KOLOSAL_MODEL = "GLM 4.6"; // Best model for Indonesian nuances
const REQUEST_TIMEOUT_MS = 60000; // 60 Seconds timeout safety

// Interfaces for Type Safety
interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface KolosalResponse {
  id: string;
  choices: {
    index: number;
    message: ChatMessage;
    finish_reason: string;
  }[];
  usage?: {
    total_tokens: number;
  };
}

/**
 * Generates marketing copy (Copywriting) using Kolosal AI.
 * Uses 'Multi-Persona' prompting technique to generate 3 distinct style variations.
 */
export const generateMarketingCopy = async (
  imageDescription: string, 
  apiKey: string
): Promise<string> => {
  
  // 1. Input Validation
  if (!apiKey) {
    throw new Error("Configuration Error: Kolosal API Key is missing.");
  }
  if (!imageDescription) {
    throw new Error("Input Error: Image description is empty.");
  }

  // 2. Advanced System Prompt Engineering
  // Defines a specific persona and strict formatting rules.
  // The prompt text remains in INDONESIAN to ensure the output is in Indonesian.
  const systemPrompt = `
    Anda adalah 'Copywriter Master' dengan spesialisasi pasar UMKM Indonesia. 
    Tugas Anda adalah mengubah deskripsi visual produk menjadi konten media sosial yang menarik.

    INSTRUKSI UTAMA:
    Buatlah 3 (tiga) variasi caption yang SANGAT BERBEDA berdasarkan deskripsi visual yang diberikan.

    GAYA BAHASA (TONE OF VOICE):
    1. Opsi 1: [GAYA VIRAL & KEKINIAN] 
       - Target: Gen Z / TikTok / Instagram Reels.
       - Bahasa: Santai, gaul, menggunakan slang wajar, penuh energi (Hype).
       - Gunakan emoji yang ekspresif.

    2. Opsi 2: [GAYA PROFESIONAL & ELEGAN]
       - Target: LinkedIn / Katalog Resmi / Konsumen Premium.
       - Bahasa: Baku, sopan, meyakinkan, fokus pada kualitas dan fitur (Benefit-oriented).
       - Minimalis dalam penggunaan emoji.

    3. Opsi 3: [GAYA STORYTELLING & SOFT-SELLING]
       - Target: Facebook / Ibu-ibu / Komunitas Whatsapp.
       - Bahasa: Bertutur (bercerita), menyentuh emosi, solutif.
       - Ajak pembaca berinteraksi (Call to Action berupa pertanyaan).

    FORMAT OUTPUT (WAJIB DIPATUHI):
    - Jangan gunakan penomoran "1.", "2.", "3." di awal teks.
    - Pisahkan setiap variasi HANYA dengan string ini: "---BATAS_VARIASI---"
    - Sertakan 3-5 hashtag relevan di setiap akhir variasi.
  `;

  // 3. Setup AbortController for Timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    // 4. Execute Request
    const response = await fetch(KOLOSAL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: KOLOSAL_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Deskripsi Visual Produk: "${imageDescription}"` }
        ],
        temperature: 0.8, // Slightly higher creative freedom for marketing
        top_p: 0.95,
        max_tokens: 1500
      })
    });

    clearTimeout(timeoutId); // Clear timeout on success

    // 5. Robust Error Handling
    if (!response.ok) {
      let errorMessage = `HTTP Error ${response.status}`;
      
      try {
        // Attempt to read error body (JSON or Text)
        const rawBody = await response.text();
        
        try {
          const errorJson = JSON.parse(rawBody);
          // Standardize error message from nested objects
          errorMessage = errorJson?.error?.message || errorJson?.message || rawBody;
        } catch {
          // Fallback to raw text if not JSON
          errorMessage = rawBody.length > 200 ? rawBody.substring(0, 200) + "..." : rawBody;
        }
      } catch (readError) {
        errorMessage = response.statusText || "Connection Failed";
      }

      throw new Error(`Kolosal API Failed: ${errorMessage}`);
    }

    // 6. Parse Successful Response
    const data: KolosalResponse = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error("API responded successfully but returned no text content.");
    }

    return content;

  } catch (error: any) {
    // Handle Timeout Specific Error
    if (error.name === 'AbortError') {
      throw new Error(`Request timeout. Kolosal AI service did not respond within ${REQUEST_TIMEOUT_MS / 1000} seconds.`);
    }

    console.error("🔴 Kolosal Service Error:", error);
    // Re-throw specific message only to keep UI clean
    throw new Error(error.message || "Failed to contact AI service.");
  } finally {
    clearTimeout(timeoutId); // Ensure cleanup
  }
};
