# Contributing to Tanggalan

Terima kasih atas minat Anda untuk berkontribusi pada pustaka **Tanggalan**! Proyek ini berfokus pada logika konversi dan perhitungan kalender Jawa yang akurat dan efisien menggunakan Rust.

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

Pastikan telah menginstal [Rust dan Cargo](https://www.rust-lang.org/tools/install).

    # Clone repositori
    git clone -b rust https://github.com/bect/tanggalan.git
    cd tanggalan

### Struktur Proyek

- `src/`: Kode sumber utama pustaka (Rust).
- `tests/`: Integration tests.

### Perintah Penting

Fokus utama pengembangan adalah pada logika di `src/`.

- **Menjalankan Tes**: Wajib dijalankan sebelum membuat Pull Request untuk memastikan logika perhitungan benar.

      cargo test

- **Build Library**: Memastikan kode dapat dikompilasi.

      cargo build --release

- **Format Kode**: Pastikan kode mengikuti standar format Rust.

      cargo fmt