# Berkontribusi pada Tanggalan

Terima kasih atas minat Anda untuk berkontribusi pada Tanggalan! Kami menyambut kontribusi dari komunitas untuk membantu meningkatkan pustaka Kalender Jawa ini untuk Go.

## Cara Berkontribusi

### Melaporkan Bug

Jika Anda menemukan bug, silakan buka issue di GitHub. Sertakan:
- Judul dan deskripsi yang jelas.
- Langkah-langkah untuk mereproduksi masalah.
- Perilaku yang diharapkan vs aktual.
- Cuplikan kode atau kasus uji jika memungkinkan.

### Menyarankan Peningkatan

Punya ide? Buka issue dengan label "enhancement". Jelaskan fitur tersebut dan mengapa itu akan berguna.

### Pull Requests

1.  **Fork repositori** dan buat branch Anda dari `main`.
2.  **Instal dependensi**:
    ```bash
    go mod download
    ```
3.  **Lakukan perubahan**. Pastikan kode Anda mengikuti konvensi standar Go.
4.  **Jalankan pengujian**:
    ```bash
    go test -v ./...
    ```
5.  **Tambahkan tes baru** jika Anda menambahkan fitur baru atau memperbaiki bug.
6.  **Format kode Anda**:
    ```bash
    go fmt ./...
    ```
7.  **Kirim Pull Request**. Berikan deskripsi yang jelas tentang perubahan Anda.

## Pedoman Pengkodean

- Ikuti Effective Go.
- Gunakan `go fmt` untuk memformat kode Anda.
- Pastikan semua tes lulus sebelum mengirimkan.
- Jaga agar API konsisten dengan struktur yang ada.

## Lisensi

Dengan berkontribusi, Anda setuju bahwa kontribusi Anda akan dilisensikan di bawah Lisensi ISC.