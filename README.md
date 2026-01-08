# ⚡ Konten Kilat AI

**Aplikasi Web Penghasil *Caption* Pemasaran Otomatis untuk UMKM Indonesia**

[](https://github.com/azarrstore/konten-kilat-AI)
[](https://www.google.com/search?q=LICENSE)
[](https://reactjs.org/)

## 📝 Daftar Isi

  * [Tentang Proyek](https://www.google.com/search?q=%23tentang-proyek)
  * [Fitur Utama](https://www.google.com/search?q=%23fitur-utama)
  * [Teknologi yang Digunakan](https://www.google.com/search?q=%23teknologi-yang-digunakan)
  * [Memulai (Getting Started)](https://www.google.com/search?q=%23memulai-getting-started)
      * [Prasyarat](https://www.google.com/search?q=%23prasyarat)
      * [Instalasi Lokal](https://www.google.com/search?q=%23instalasi-lokal)
  * [Cara Penggunaan](https://www.google.com/search?q=%23cara-penggunaan)
  * [Kontribusi](https://www.google.com/search?q=%23kontribusi)
  * [Lisensi](https://www.google.com/search?q=%23lisensi)

-----

## 🚀 Tentang Proyek

**Konten Kilat AI** adalah aplikasi web inovatif yang dirancang untuk **memberdayakan Usaha Mikro, Kecil, dan Menengah (UMKM) di Indonesia** dengan memanfaatkan kecerdasan buatan (AI) generatif mutakhir.

Misi kami sederhana: menghilangkan hambatan dalam pembuatan materi pemasaran yang profesional. Cukup dengan mengunggah foto produk, pemilik usaha dapat langsung menerima beberapa pilihan *caption* pemasaran yang terstruktur dan menarik dalam hitungan detik.

Proyek ini menggunakan kombinasi model AI yang kuat, termasuk **ColossalAI GLM 4.6** untuk pemrosesan cepat dan **Gemini Flash 2.5** untuk analisis gambar mendalam, memastikan konten yang dihasilkan relevan dan berkualitas tinggi.

## ✨ Fitur Utama

Aplikasi ini menawarkan serangkaian fitur yang fokus pada kecepatan dan efisiensi *content generation*:

  * **Analisis Gambar Produk Berbasis AI**: Menganalisis elemen visual dalam foto produk untuk mengekstrak detail, tekstur, dan *Unique Selling Proposition* (USP).
  * **Generasi *Caption* Otomatis**: Mengubah hasil analisis gambar menjadi beberapa opsi *caption* pemasaran yang profesional dan siap pakai.
  * **Aksi Cepat**: Pengguna dapat **menyalin** *caption* dengan satu klik atau **langsung menekan navigasi** untuk memposting ke platform media sosial terkait.
  * **Dukungan UMKM**: Dirancang khusus dengan mempertimbangkan kebutuhan dan bahasa pemasaran yang cocok untuk pasar Indonesia.

## 🛠️ Teknologi yang Digunakan

Proyek ini dibangun menggunakan *stack* modern untuk memastikan kinerja dan skalabilitas yang optimal.

  * **Frontend**:
      * [React](https://reactjs.org/)
      * [TypeScript](https://www.typescriptlang.org/)
  * **AI/Backend**:
      * [Google Gemini API (Gemini Flash 2.5)](https://ai.google.dev/models/gemini) (sebagai model pembaca gambar/visual)
      * [ColossalAI GLM 4.6](https://www.kolosal.ai/) 
  * **Manajemen Paket**:
      * [Node.js](https://nodejs.org/) & [npm](https://www.npmjs.com/)

-----

## ⚙️ Memulai (Getting Started)

Ikuti langkah-langkah di bawah ini untuk menjalankan **Konten Kilat AI** di lingkungan pengembangan lokal Anda.

### Prasyarat

Pastikan Anda telah menginstal *tools* berikut di mesin Anda:

  * **Node.js** (Versi 20+ atau diatasnya)
  * **npm** (Biasanya terinstal bersama Node.js)

### Instalasi Lokal

1.  **Kloning Repositori:**

    ```bash
    git clone https://github.com/azarrstore/konten-kilat-AI.git
    cd konten-kilat-AI
    ```

2.  **Instal Dependensi:**
    Jalankan perintah ini untuk menginstal semua paket dan *library* yang diperlukan:

    ```bash
    npm install
    ```

3.  **Konfigurasi Kunci API:**
    Proyek ini membutuhkan kunci API untuk mengakses model Gemini.

      * Buat file baru bernama `.env.local` di *root directory* proyek.
      * Tambahkan kunci API Anda di dalamnya:
        ```env
        # Dapatkan Kunci API Anda dari Google AI Studio
        GEMINI_API_KEY="ISI_KUNCI_API_ANDA_DI_SINI"
        ```

4.  **Jalankan Aplikasi:**
    Setelah semua konfigurasi selesai, jalankan aplikasi dalam mode pengembangan:

    ```bash
    npm run dev
    ```

    Aplikasi akan tersedia di `http://localhost:3000` (atau *port* lain yang ditetapkan).

-----

## 💡 Cara Penggunaan

Penggunaan **Konten Kilat AI** sangat intuitif dan dirancang untuk efisiensi UMKM:

1.  Akses aplikasi web di *browser* Anda.
2.  Tekan tombol **"Unggah Foto Produk"** dan pilih gambar dari komputer Anda.
3.  Sistem akan secara otomatis memproses gambar menggunakan model AI.
4.  Dalam beberapa detik, Anda akan disajikan dengan beberapa pilihan *caption* yang berbeda.
5.  **Pilih *Caption***:
      * Klik ikon **Salin (Copy)** untuk menyalin teks ke *clipboard*.
      * Klik ikon **Bagikan (Share)** untuk diarahkan langsung ke platform media sosial untuk memposting.

-----

## 🤝 Kontribusi

Kami sangat menyambut kontribusi dari komunitas\! Jika Anda seorang **UMKM**, **spesialis konten**, **pengembang**, atau **peserta *hackathon***, ide dan *pull request* Anda sangat berharga.

1.  *Fork* repositori ini.
2.  Buat *branch* fitur baru (`git checkout -b fitur/NamaFiturBaru`).
3.  Lakukan perubahan Anda dan *commit* (`git commit -m 'Tambahkan Fitur: Nama Fitur'`).
4.  *Push* ke *branch* (`git push origin fitur/NamaFiturBaru`).
5.  Buka *Pull Request* baru (PR) dan jelaskan perubahan yang Anda buat.

## 🙏 Terima Kasih
   **IMPHNEN X KOLOSAL** atas kesempatan hackathon ini.
   **GoogleGemini & Kolosal AI** untuk penyediaan API yang hebat.
   Semua kontributor yang telah membantu mengembangkan proyek ini.
## 📄 Lisensi

Proyek ini dilisensikan di bawah **Lisensi MIT**. Lihat file [`LICENSE`](https://www.google.com/search?q=LICENSE) untuk detail lebih lanjut.

-----

*Dibuat oleh Azarr & AunuHost (NCHMPK Team) ❤️ untuk kemajuan UMKM Indonesia.*
