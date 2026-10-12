import { GoogleGenAI } from "@google/genai";

const MODEL_NAME = 'gemini-2.5-flash';

interface AnalysisOptions {
  temperature?: number;
  topK?: number;
}

const cleanBase64 = (rawBase64: string): string => {
  // ponytail: handle charset param e.g. data:image/png;charset=utf-8;base64,
  return rawBase64.replace(/^data:[^,]+;base64,/, "");
};

const resolveApiKey = (): string | undefined => {
  // Direct literal access so Vite define can replace at build time
  try {
    const direct = (process as any)?.env?.GEMINI_API_KEY || (process as any)?.env?.API_KEY;
    if (direct) return direct;
  } catch {}
  // Fallback via import.meta.env (Vite standard)
  try {
    const m = (import.meta as any)?.env;
    if (m?.GEMINI_API_KEY) return m.GEMINI_API_KEY;
    if (m?.VITE_GEMINI_API_KEY) return m.VITE_GEMINI_API_KEY;
    if (m?.API_KEY) return m.API_KEY;
  } catch {}
  // Legacy env names
  try {
    const p = typeof process !== 'undefined' ? (process as any).env : undefined;
    if (p?.NEXT_PUBLIC_GEMINI_API_KEY) return p.NEXT_PUBLIC_GEMINI_API_KEY;
    if (p?.REACT_APP_GEMINI_API_KEY) return p.REACT_APP_GEMINI_API_KEY;
  } catch {}
  return undefined;
};

export const analyzeImageWithGemini = async (
  base64Image: string, 
  mimeType: string,
  options: AnalysisOptions = {}
): Promise<string> => {
  const apiKey = resolveApiKey();
  if (!apiKey) {
    throw new Error("Konfigurasi Error: GEMINI_API_KEY tidak ditemukan di environment variables.");
  }
  const ai = new GoogleGenAI({ apiKey });
  try {
    const safeMime = mimeType && mimeType.startsWith('image/') ? mimeType : 'image/jpeg';
    const imagePart = {
      inlineData: {
        mimeType: safeMime,
        data: cleanBase64(base64Image)
      }
    };
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
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      config: {
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
    if (!response || !response.text) {
      throw new Error("Gemini berhasil dihubungi, namun tidak mengembalikan respons teks.");
    }
    return response.text.trim();
  } catch (error: any) {
    console.group("🔴 Gemini Analysis Error");
    console.error("Message:", error.message);
    if (error.status) console.error("Status Code:", error.status);
    console.groupEnd();
    throw new Error(
      `Gagal menganalisis gambar: ${error.message || "Terjadi kesalahan koneksi ke Google AI."}`
    );
  }
};
