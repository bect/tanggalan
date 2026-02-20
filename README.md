# Tanggalan (Rust)
Pustaka JavaScript lengkap untuk konversi Kalender Jawa. Mendukung Weton, Wuku, Neptu, Mongso (Solar), dan Waktu Tradisional (Wektu). Mendukung target **Rust**, **WebAssembly (Node.js/Browser)**, dan **Python**.

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

### 🦀 Rust (Cargo)

Tambahkan ke `Cargo.toml`:

```toml
[dependencies]
tanggalan = { git = "https://github.com/bect/tanggalan" }
```

### 📦 Node.js / Web (NPM)

```bash
npm install @bect/tanggalan
```

### 🐍 Python (PyPI)

```bash
pip install tanggalan
```

## Penggunaan

### Rust

```rust
use tanggalan::core::JavaneseDate;
use chrono::NaiveDate;

fn main() {
    // 17 Agustus 2023
    let date = NaiveDate::from_ymd_opt(2023, 8, 17).unwrap()
        .and_hms_opt(12, 0, 0).unwrap();
    
    let jd = JavaneseDate::new(date);
    
    println!("Hari: {}", jd.dina);       // Kemis
    println!("Pasaran: {}", jd.pasaran); // Legi
    println!("Lengkap: {}", jd);         // Kemis Legi, 29 Sura 1957 Ja, Bedhug
}
```

### JavaScript / TypeScript

```javascript
import { Tanggalan } from "@bect/tanggalan";

// Tanggal saat ini
const now = new Tanggalan();
console.log(now.toString());

// Tanggal tertentu
const date = new Tanggalan(new Date("2023-08-17"));
console.log(`Weton: ${date.dina} ${date.pasaran}`); // Weton: Kemis Legi
```

### Python

```python
from tanggalan import Tanggalan
from datetime import datetime

# Tanggal saat ini
now = Tanggalan()
print(now)

# Tanggal tertentu
date = Tanggalan(datetime(2023, 8, 17))
print(f"Weton: {date.dina} {date.pasaran}") # Weton: Kemis Legi
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

## Dokumentasi Teknis

Ingin tahu bagaimana perhitungan matematis di balik kalender ini?

Baca [Algoritma Perhitungan Kalender Jawa](./ALGORITHM.md).

Untuk full dokumentasi penggunaan beserta detail api untuk [Python](./docs/PYTHON.md), [Node/Web](./docs/JS.md), dan [Rust](./docs/RUST.md) masing masing berada di folder [docs](./docs).

## Referensi

- [PRANOTO MONGSO (Penentuan Musim)](https://niagakita.id/2019/05/08/pranoto-mongso-penentuan-musim/)
- [Tanggalan Jawa](https://tanggalanjawa.com/)
- [Sejarah Kalender Jawa dan Fungsi Kegunaan](https://percetakanku.co.id/sejarah-kalender-jawa-dan-fungsi-kegunaan/)
- [Arane Wektu: Penyebutan Istilah Waktu dalam Bahasa Jawa](https://yogyakarta.kompas.com/read/2023/11/05/195150778/arane-wektu-penyebutan-istilah-waktu-dalam-bahasa-jawa?page=all)
- [Penanggalan Jawa atau Kalender Jawa](https://www.nanokaryamandiri.com/campuran/penanggalan-jawa-atau-kalender-jawa)

## Lisensi

ISC