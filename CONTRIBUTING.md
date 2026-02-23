# Contributing to Tanggalan

Terima kasih atas minat Anda untuk berkontribusi pada pustaka **Tanggalan**! Proyek ini berfokus pada logika konversi dan perhitungan kalender Jawa yang akurat dan efisien (Python).

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

Pastikan telah menginstal Python (versi 3.8 atau lebih baru).

    # Clone repositori
    git clone -b python https://github.com/bect/tanggalan.git
    cd tanggalan

    # Buat virtual environment (opsional tapi disarankan)
    python -m venv venv
    source venv/bin/activate  # Atau venv\Scripts\activate di Windows

    # Instal dependensi dalam mode editable
    pip install -e ".[test]"

### Struktur Proyek

- `core.py`: Kode sumber utama pustaka.
- `tests/`: Unit test.

### Perintah Penting

Fokus utama pengembangan adalah pada logika di `core.py`.

- **Menjalankan Tes**: Wajib dijalankan sebelum membuat Pull Request untuk memastikan logika perhitungan benar.

      pytest