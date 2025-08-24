# Menambah Konten

Untuk menambah konten, cukup edit file `data.js`. Aplikasi akan otomatis membaca perubahan tanpa perlu mengubah komponen lain.

Langkah singkat:
- Buka `data.js`
- Tambahkan item baru mengikuti struktur yang sudah ada
- Simpan file dan jalankan ulang/development server akan reload otomatis

Contoh struktur:
```js
const data = [
    // item sebelumnya...
    {
        id: 'unik-001',
        title: 'Judul Konten',
        description: 'Deskripsi singkat',
        // field lain yang digunakan aplikasi...
    }
];

export default data;
```