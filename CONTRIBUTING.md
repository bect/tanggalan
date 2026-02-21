# Contributing to Tanggalan

Terima kasih atas minat Anda untuk berkontribusi pada pustaka **Tanggalan**! Proyek ini berfokus pada logika konversi dan perhitungan kalender Jawa yang akurat dan efisien.

## Cara Berkontribusi

### Melaporkan Bug

Jika Anda menemukan kesalahan perhitungan atau masalah lain:
1. Cek tab **Issues** untuk memastikan bug belum dilaporkan sebelumnya.
2. Buat Issue baru dengan deskripsi jelas, langkah-langkah untuk mereproduksi, dan hasil yang diharapkan vs hasil aktual.

### Mengirimkan Perubahan (Pull Request)

1. **Fork** repositori ini.
2. Buat branch fitur baru (`git checkout -b fitur/NamaFiturKeren`).
3. Lakukan perubahan kode.
4. Pastikan kode berjalan dengan baik dan lulus tes.
5. Commit perubahan Anda (`git commit -m 'Menambahkan fitur X'`).
6. Push ke branch (`git push origin fitur/NamaFiturKeren`).
7. Buat **Pull Request** ke branch `main` repositori ini.

## Panduan Pengembangan

### Persiapan Lingkungan

Pastikan telah menginstal Node.js.

    # Clone repositori
    git clone https://github.com/bect/tanggalan.git
    cd tanggalan

    # Instal dependensi
    npm install

### Struktur Proyek

- `lib/`: Kode sumber utama pustaka.
- `test/`: Unit test dan functional test.
- `benchmark/`: Skrip uji performa.
- `pages/`: Aplikasi demo/visualizer (opsional).

### Perintah Penting

Fokus utama pengembangan adalah pada logika di `lib/tanggalan.js`.

- **Menjalankan Tes**: Wajib dijalankan sebelum membuat Pull Request untuk memastikan logika perhitungan benar.

      npm test

- **Uji Performa (Benchmark)**: Pastikan perubahan tidak menurunkan performa secara signifikan.

      npm run benchmark

- **Build Library**: Mengkompilasi dan meminifikasi library ke folder `dist/`.

      npm run build

### Pengembangan Demo (Opsional)

Jika perlu memverifikasi hasil secara visual atau mengubah halaman demo:

- **Preview Halaman**: Membangun dan menjalankan server lokal.

      npm run preview