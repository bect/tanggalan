# Dokumentasi Penggunaan Rust

Pustaka `tanggalan` menyediakan API Rust murni untuk perhitungan kalender Jawa.

## Instalasi

Tambahkan dependensi berikut ke `Cargo.toml` Anda:

```toml
[dependencies]
tanggalan = "1.1.1"
chrono = "0.4"
```

## Penggunaan Dasar

Inti dari pustaka ini adalah struct `JavaneseDate`.

```rust
use tanggalan::JavaneseDate;
use chrono::NaiveDate;

fn main() {
    // 1. Membuat tanggal Masehi (17 Agustus 1945)
    // Jam 12:00 digunakan untuk menghindari ambiguitas pergantian hari
    let date = NaiveDate::from_ymd_opt(1945, 8, 17).unwrap()
        .and_hms_opt(12, 0, 0).unwrap();

    // 2. Konversi ke Tanggal Jawa
    let jd = JavaneseDate::new(date);

    // 3. Akses Properti
    println!("Dina: {}", jd.dina);       // Jemuah
    println!("Pasaran: {}", jd.pasaran); // Legi
    println!("Wuku: {}", jd.wuku);       // Manahil
    println!("Neptu: {}", jd.neptu);     // 11 (Jemuah 6 + Legi 5)
    
    // Output default (Display trait)
    println!("Lengkap: {}", jd); 
    // Output: Jemuah Legi, 9 Pasa 1876 Ja, Lingsir Wengi
}
```

## Parsing String

Anda dapat membuat objek `JavaneseDate` dari string tanggal Jawa.

```rust
use tanggalan::JavaneseDate;

fn main() {
    let input = "28 Jumadilawal 1955";
    let format = "d M yyyy";

    match JavaneseDate::from_string(input, format) {
        Ok(jd) => {
            println!("Berhasil parse: {}", jd);
            println!("Weton: {} {}", jd.dina, jd.pasaran);
        },
        Err(e) => println!("Error: {}", e),
    }
}
```

## Formatting

Gunakan method `format_string` untuk memformat output sesuai kebutuhan.

```rust
let pattern = "Dina: D, Pasaran: P, Mongso: MS";
println!("{}", jd.format_string(pattern));
// Output: Dina: Jemuah, Pasaran: Legi, Mongso: Karo
```

### Token Format

Berikut adalah daftar token yang dapat digunakan dalam string format:

| Token | Deskripsi | Contoh |
| :--- | :--- | :--- |
| `D` | Nama Hari (Dina) | Setu |
| `P` | Pasaran | Pahing |
| `d` | Tanggal (1-30) | 26 |
| `dd` | Tanggal (01-30) | 26 |
| `M` | Nama Bulan (Wulan) | Ruwah |
| `m` | Nomor Bulan (1-12) | 8 |
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

## Fitur Lanjutan

### Mencari Weton Berikutnya (`weton_sabanjure`)

Mencari tanggal terdekat di masa depan yang memiliki kombinasi Dina dan Pasaran tertentu.

```rust
let next_weton = jd.weton_sabanjure("Senen Legi");
match next_weton {
    Ok(date) => println!("Senen Legi berikutnya: {}", date),
    Err(e) => println!("Error: {}", e),
}
```

### Cek Tahun Kabisat (`is_kabisat`)

```rust
if jd.is_kabisat() {
    println!("Tahun {} adalah tahun kabisat (355 hari)", jd.taun_jawa);
} else {
    println!("Tahun {} adalah tahun basit (354 hari)", jd.taun_jawa);
}
```

## Referensi API

### Struct `JavaneseDate`

Struct utama yang menyimpan informasi tanggal Jawa.

#### Static Methods

- **`from_string(input: &str, format: &str) -> Result<JavaneseDate, String>`**: Membuat instance dari string tanggal Jawa.
- **`new(date: NaiveDateTime) -> JavaneseDate`**: Membuat instance baru dari tanggal Masehi.

#### Properties (String)

| Field | Tipe | Deskripsi |
| :--- | :--- | :--- |
| `dina` | `&'static str` | Nama hari (misal: "Senen") |
| `pasaran` | `&'static str` | Nama pasaran (misal: "Wage") |
| `wulan` | `&'static str` | Nama bulan (misal: "Sura") |
| `taun` | `&'static str` | Nama tahun (misal: "Ehe") |
| `wuku` | `&'static str` | Nama wuku |
| `mongso` | `&'static str` | Nama mongso |
| `wektu` | `&'static str` | Waktu hari (misal: "Surup") |

#### Methods & Numeric Properties

Di Rust, sebagian besar "getter" diimplementasikan sebagai public field untuk efisiensi.

- **`day_jawa`**: `u32` - Tanggal Jawa.
- **`dina_index`**: `usize` - Indeks hari (0=Minggu, 6=Setu).
- **`wulan_index`**: `usize` - Indeks bulan (0=Sura).
- **`taun_jawa`**: `i32` - Tahun Jawa.
- **`pasaran_index`**: `usize` - Indeks pasaran (0=Legi).
- **`neptu`**: `u8` - Total nilai neptu.
- **`wuku_index`**: `usize` - Indeks wuku (0=Sinta).
- **`native_date`**: `NaiveDateTime` - Objek tanggal asli dari `chrono`.
- **`is_kabisat(&self) -> bool`**: Mengecek apakah tahun Jawa saat ini adalah tahun kabisat (355 hari).
- **`weton_sabanjure(&self, weton_name: &str) -> Result<JavaneseDate, String>`**: Mencari tanggal terjadinya weton tertentu di masa depan.
- **`format_string(&self, pattern: &str) -> String`**: Memformat tanggal menjadi string menggunakan token.
- **`to_string(&self) -> String`**: (via `Display` trait) Representasi string default.

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