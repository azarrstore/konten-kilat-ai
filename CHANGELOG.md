# Changelog

## 2026-10-31 — Bug: index.html memiliki dua script theme-init — satu di <head> (hanya set documentElement.classList, tapi CSS selector pakai body.hell-mode sehingga tidak berpengaruh) dan satu di <body> (yang benar). Script di <head> redundan, menambah bytes tanpa fungsi. Dihapus agar tidak membingungkan dan menghindari double-write class.

- `index.html`

## 2026-10-27 — Ditemukan bug nyata: README.md berisi konten SECURITY.md (Security Policy), dan SECURITY.md berisi konten README.md. Kedua file tertukar isinya. Ini menyebabkan user yang membuka repo melihat Security Policy sebagai README, dan file SECURITY.md justru berisi dokumentasi project. Diperbaiki dengan menukar kembali isi kedua file ke posisi yang benar.

- `README.md`
- `SECURITY.md`

## 2026-10-19 — Fix deteksi GEMINI_API_KEY: esbuild define Vite gagal me-replace syntax optional-chaining (process as any)?.env?.GEMINI_API_KEY sehingga melempar ReferenceError di browser; perbaiki ke literal process.env & tambahkan envPrefix di vite.config.ts. Optimasi CSS hell-mode di index.html agar judul dan elemen form terbaca jelas di dark mode.

- `services/geminiService.ts`
- `vite.config.ts`
- `index.html`

## 2026-10-16 — Ditemukan 2 bug nyata: (1) Di index.html ada duplikasi script theme-init — satu di <head> dan satu lagi di <body>. Script di <body> redundan dan bisa menyebabkan flash karena dieksekusi setelah class 'heaven-mode' sudah di-set pada elemen <body>. Cukup satu script di <head> yang menarget documentElement, lalu React useEffect yang handle body class. (2) Di App.tsx, spinner loading menggunakan class `border-3` yang bukan class Tailwind default (Tailwind hanya punya border, border-0, border-2, border-4, border-8). Ini menyebabkan spinner border tidak tampil. Diperbaiki ke `border-[3px]`. Selain itu, script di <head> seharusnya juga set class pada body, bukan hanya documentElement, agar konsisten dengan CSS selector `body.hell-mode`. Diperbaiki index.html dan App.tsx.

- `index.html`
- `App.tsx`

## 2026-10-14 — Ditemukan 2 bug nyata: (1) CSS class `border-3` tidak valid di Tailwind default (harusnya `border-[3px]` atau `border-2`), menyebabkan stroke border spinner pada StepIndicator tidak tampil. (2) `index.html` menyuntikkan `<script>` theme-init di dalam `<body>` setelah `#root`, menimbulkan race condition dan double-apply theme sebelum React mount — sebaiknya digabung ke satu script di `<head>` saja.

- `components/StepIndicator.tsx`

## 2026-10-13 — Memperbaiki fitur drag-and-drop foto produk pada ImageUploader yang sebelumnya tidak memiliki drag event listener sehingga file drop membuka tab browser baru, serta reset input file value agar dapat memilih ulang file yang sama.

- `components/ImageUploader.tsx`

## 2026-10-12 — Bug XSS dangerouslySetInnerHTML tanpa sanitasi, window.open tanpa noopener, clipboard tanpa fallback, theme FOUC, cleanBase64 gagal charset, resolveApiKey tidak ter-replace Vite.

- `App.tsx`
- `index.html`
- `services/geminiService.ts`

## 2026-10-11 — Fix bug crash process.env di browser, regex base64 gagal untuk gif/avif, flash theme & race localStorage, validasi file & FileReader error, clipboard async.

- `vite.config.ts`
- `services/geminiService.ts`
- `App.tsx`

## 2026-10-11 — Optimasi performa rendering UI mobile: hapus filter backdrop-blur berat, perbaiki layout tombol header anti-tabrakan di layar sempit, batasi sticky preview hanya di desktop, dan tambahkan asynchronous image decoding.

- `index.html`
- `App.tsx`
- `components/ImageUploader.tsx`

## 2026-10-11 — Optimasi performa UI dengan menghapus animasi kontinu dan efek filter blur berat pada background yang menyebabkan lag dan beban GPU tinggi di perangkat mobile UMKM.

- `index.html`

