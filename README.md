# SILIKAR-SUMUT

Purwarupa aplikasi seluler React untuk esai **SILIKAR-SUMUT: Integrasi Aplikasi Seluler, Kembaran Digital, dan Kecerdasan Buatan pada Baterai Silikon Karbon Limbah Sawit untuk Mobil Listrik demi Keberlanjutan Energi dan Lingkungan**.

Seluruh data di aplikasi ini adalah dummy, statis, dan hanya untuk simulasi. Tidak ada backend, basis data, API, autentikasi nyata, perhitungan otomatis, atau model kecerdasan buatan sungguhan.

## Teknologi

- React
- Vite
- TypeScript
- React Router DOM
- Lucide React
- CSS biasa
- localStorage untuk menyimpan peran

## Menjalankan Lokal

```bash
npm install
npm run dev -- --host 0.0.0.0
```

Perintah pemeriksaan:

```bash
npm run lint
npm run build
npm run preview
```

## Rute Aplikasi

- `/` - Splash screen gagasan SILIKAR-SUMUT
- `/pilih-peran`
- `/masuk`
- `/pemilik/kondisi`
- `/pemilik/prediksi`
- `/pemilik/rute`
- `/pemilik/pengisian`
- `/pengembang/bahan`
- `/pengembang/kembaran`
- `/pengembang/ai`
- `/pengembang/evaluasi`
- `/penguji/mutu`
- `/penguji/keselamatan`
- `/penguji/daur-hidup`
- `/penguji/kelayakan`

## Kesiapan Vercel

Konfigurasi `vercel.json` sudah disiapkan untuk React Router SPA:

- Framework: Vite
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: `dist`

Tidak ada variabel lingkungan yang diperlukan.
