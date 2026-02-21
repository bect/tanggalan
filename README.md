# Tanggalan

Pustaka JavaScript lengkap untuk konversi Kalender Jawa. Mendukung Weton, Wuku, Neptu, Mongso (Solar), dan Waktu Tradisional (Wektu).

## Fitur

- **Konversi Masehi ke Jawa**: Mengubah tanggal Gregorian menjadi penanggalan Jawa.
- **Parsing String Jawa**: Membuat objek dari string (misal: "28 Jumadilawal 1955").
- **Komponen Penanggalan**:
  - **Pasaran**: Legi, Pahing, Pon, Wage, Kliwon.
  - **Wuku**: 30 siklus mingguan (Sinta s.d. Watugunung).
  - **Mongso**: Kalender musim/pertanian (Kasa s.d. Sada).
  - **Neptu**: Nilai numerik gabungan hari dan pasaran.
  - **Wektu**: Pembagian waktu tradisional (misal: "Surup", "Lingsir Wengi").
- **Fitur Tambahan**:
  - **Kabisat**: Deteksi tahun kabisat Jawa.
  - **Weton Sabanjure**: Mencari tanggal terjadinya weton tertentu di masa depan.
  - **Gregorian**: Akses mudah ke objek `Date` native.
  - **Timezone**: Dukungan parsing dan formatting timezone offset.

## Instalasi

```bash
npm install @bect/tanggalan
```

## Penggunaan

### Penggunaan Dasar

```javascript
const Tanggalan = require('@bect/tanggalan');

// Gunakan tanggal saat ini
const now = new Tanggalan();
console.log(now.toString());
// Contoh output: "Setu Pahing, 26 Ruwah 1959 Ja, Surup"

// Gunakan tanggal tertentu
const date = new Tanggalan(new Date('2023-08-17'));
console.log(date.dina);    // "Kemis"
console.log(date.pasaran); // "Legi"
```

### Format Output

Anda dapat memformat output menggunakan `formatString(pattern)`.

```javascript
const jd = new Tanggalan();
console.log(jd.formatString("D P, dd M yyyy"));
// Output: "Setu Pahing, 26 Ruwah 1959"
```

**Pola yang Tersedia:**

| Pola | Deskripsi | Contoh |
| :--- | :--- | :--- |
| `D` | Nama Hari (Dina) | Setu |
| `P` | Pasaran | Pahing |
| `d` | Tanggal (1-30) | 26 |
| `dd` | Tanggal (01-30) | 26 |
| `M` | Nama Bulan (Wulan) | Ruwah |
| `m` | Nomor Bulan | 8 |
| `mm` | Nomor Bulan (01-12) | 08 |
| `yyyy` | Tahun (Jawa) | 1959 |
| `T` | Nama Tahun Windu | Alip |
| `W` | Wuku | Wukir |
| `N` | Neptu | 18 |
| `MS` | Mongso | Kasa |
| `WK` | Wektu | Surup |
| `HH` | Jam | 14 |
| `MM` | Menit | 30 |
| `SS` | Detik | 00 |
| `Z` | Timezone Offset | +0700 |

## Referensi API

Untuk dokumentasi perhitungan matematis, lihat [ALGORITHM.md](./ALGORITHM.md).

### Properti

- `dina`: String - Nama hari (misal: "Senen")
- `pasaran`: String - Nama pasaran (misal: "Wage")
- `wulan`: String - Nama bulan (misal: "Sura")
- `sasi`: String - Alias untuk `wulan`
- `taun`: String - Nama tahun (misal: "Ehe")
- `wuku`: String - Nama wuku
- `mongso`: String - Nama mongso
- `wektu`: String - Waktu hari

### Metode

- `getDate()`: Mengembalikan tanggal Jawa.
- `getDay()`: Mengembalikan indeks hari (0=Minggu, 6=Setu).
- `getMonth()`: Mengembalikan indeks bulan (0=Sura).
- `getFullYear()`: Mengembalikan tahun Jawa.
- `getPasaran()`: Mengembalikan indeks pasaran.
- `getNeptu()`: Mengembalikan total nilai neptu.
- `getWuku()`: Mengembalikan indeks wuku.
- `isKabisat()`: Mengembalikan `true` jika tahun kabisat.
- `wetonSabanjure(weton)`: Mengembalikan instance Tanggalan untuk weton berikutnya.
- `fromString(str, fmt)`: (Static) Membuat instance dari string.

## Referensi

- [PRANOTO MONGSO (Penentuan Musim)](https://niagakita.id/2019/05/08/pranoto-mongso-penentuan-musim/)
- [Tanggalan Jawa](https://tanggalanjawa.com/)
- [Sejarah Kalender Jawa dan Fungsi Kegunaan](https://percetakanku.co.id/sejarah-kalender-jawa-dan-fungsi-kegunaan/)
- [Arane Wektu: Penyebutan Istilah Waktu dalam Bahasa Jawa](https://yogyakarta.kompas.com/read/2023/11/05/195150778/arane-wektu-penyebutan-istilah-waktu-dalam-bahasa-jawa?page=all)
- [Penanggalan Jawa atau Kalender Jawa](https://www.nanokaryamandiri.com/campuran/penanggalan-jawa-atau-kalender-jawa)