# Tanggalan

Pustaka JavaScript lengkap untuk konversi Kalender Jawa. Mendukung Weton, Wuku, Neptu, Mongso (Solar), dan Waktu Tradisional (Wektu).

## Fitur

- Konversi tanggal Masehi ke tanggal Jawa (Saka).
- Menghitung **Pasaran** (Legi, Pahing, Pon, Wage, Kliwon).
- Menghitung **Wuku** (siklus mingguan 30).
- Menghitung **Mongso** (kalender pertanian matahari).
- Menentukan **Neptu** (nilai numerik hari).
- Menentukan **Wektu** (waktu tradisional, misal: "Surup", "Lingsir Wengi").

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

## Dokumentasi Teknis

Ingin tahu bagaimana perhitungan matematis di balik kalender ini?

Baca [Algoritma Perhitungan Kalender Jawa](./ALGORITHM.md).

## Referensi API

Untuk dokumentasi teknis lengkap yang dihasilkan dari JSDoc, lihat [API.md](./API.md).

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

## Showcase

Lihat [Showcase](./SHOWCASE.md) untuk demo dan proyek yang menggunakan library ini.

## Referensi

- [PRANOTO MONGSO (Penentuan Musim)](https://niagakita.id/2019/05/08/pranoto-mongso-penentuan-musim/)
- [Tanggalan Jawa](https://tanggalanjawa.com/)
- [Sejarah Kalender Jawa dan Fungsi Kegunaan](https://percetakanku.co.id/sejarah-kalender-jawa-dan-fungsi-kegunaan/)
- [Arane Wektu: Penyebutan Istilah Waktu dalam Bahasa Jawa](https://yogyakarta.kompas.com/read/2023/11/05/195150778/arane-wektu-penyebutan-istilah-waktu-dalam-bahasa-jawa?page=all)
- [Penanggalan Jawa atau Kalender Jawa](https://www.nanokaryamandiri.com/campuran/penanggalan-jawa-atau-kalender-jawa)