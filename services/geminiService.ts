import { GoogleGenAI } from "@google/genai";

// Konfigurasi Konstanta
const MODEL_NAME = 'gemini-2.5-flash';

// Interface untuk opsi konfigurasi tambahan (jika diperlukan di masa depan)
interface AnalysisOptions {
  temperature?: number;
  topK?: number;
}

/**
 * Membersihkan string Base64 dari prefix data URI (misal: "data:image/png;base64,...")
 * Menggunakan Regex agar lebih robust terhadap variasi format browser.
 */
const cleanBase64 = (rawBase64: string): string => {
  return rawBase64.replace(/^data:image\/(png|jpeg|jpg|webp|heic);base64,/, "");
};

/**
 * Menganalisis gambar menggunakan Google Gemini Vision.
 * * Fungsi ini menggunakan teknik prompting terstruktur untuk mengekstrak elemen visual
 * yang krusial bagi copywriting pemasaran (Lighting, Material, Mood, Text).
 */
export const analyzeImageWithGemini = async (
  base64Image: string, 
  mimeType: string,
  options: AnalysisOptions = {}
): Promise<string> => {
  
  // 1. Validasi Environment Variable
  // Mendukung standard process.env atau VITE/NEXT prefix tergantung bundler Anda
  const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.REACT_APP_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("Konfigurasi Error: GEMINI_API_KEY tidak ditemukan di environment variables.");
  }

  // 2. Inisialisasi Client (Lazy Instantiation)
  const ai = new GoogleGenAI({ apiKey });

  try {
    // 3. Persiapkan Data Gambar
    const imagePart = {
      inlineData: {
        mimeType: mimeType,
        data: cleanBase64(base64Image)
      }
    };

    // 4. Advanced Prompt Engineering
    // Kita meminta AI berperan sebagai fotografer komersial & analis visual.
    const promptText = `
      Bertindaklah sebagai ahli analisis visual dan fotografer komersial profesional.
      Tugas Anda adalah membedah gambar produk ini secara mendalam untuk keperluan pembuatan konten pemasaran (copywriting).
      
      Mohon identifikasi dan deskripsikan poin-poin berikut secara detail dalam Bahasa Indonesia:
      
      1. **Objek Utama & Fisik**: Apa produknya? Apa materialnya (kulit, plastik, logam, kain)? Apa warnanya secara spesifik (misal: bukan hanya 'merah', tapi 'merah marun glossy')?
      2. **Estetika & Suasana (Vibe)**: Apakah gambarnya terlihat mewah, minimalis, ceria, rustic, atau futuristik? Bagaimana pencahayaannya?
      3. **Konteks & Latar Belakang**: Di mana produk berada? Ada properti pendukung apa saja?
      4. **Teks Terlihat (OCR)**: Tuliskan ulang teks apa pun yang tertulis pada produk atau label jika ada.
      5. **Target Audiens Tersirat**: Berdasarkan visual, siapa kira-kira yang cocok menggunakan produk ini?

      Output harus berupa paragraf deskriptif yang mengalir, objektif, namun kaya akan kata sifat visual (visual adjectives).
    `;

    // 5. Eksekusi Request dengan Konfigurasi Presisi
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      config: {
        // Temperature rendah (0.2) agar analisis visual akurat/faktual dan tidak halusinasi
        temperature: options.temperature ?? 0.2,
        topK: 40,
        maxOutputTokens: 1000,
      },
      contents: {
        parts: [
          imagePart,
          { text: promptText }
        ]
      }
    });

    // 6. Validasi Response
    if (!response || !response.text) {
      throw new Error("Gemini berhasil dihubungi, namun tidak mengembalikan respons teks.");
    }

    return response.text.trim();

  } catch (error: any) {
    // 7. Enhanced Error Logging
    // Memisahkan error jaringan, auth, atau bad request
    console.group("🔴 Gemini Analysis Error");
    console.error("Message:", error.message);
    if (error.status) console.error("Status Code:", error.status);
    console.groupEnd();

    // Re-throw dengan pesan yang user-friendly
    throw new Error(
      `Gagal menganalisis gambar: ${error.message || "Terjadi kesalahan koneksi ke Google AI."}`
    );
  }
};
