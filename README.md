# Tanggalan

Pustaka Go (Golang) lengkap untuk konversi Kalender Jawa. Mendukung Weton, Wuku, Neptu, Mongso (Solar), dan Waktu Tradisional (Wektu).

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
go get github.com/bect/tanggalan
```

## Penggunaan

### Penggunaan Dasar

```go
package main

import (
	"fmt"
	"time"

	"github.com/bect/tanggalan"
)

func main() {
	// Gunakan tanggal saat ini
	now := tanggalan.New(time.Now())
	fmt.Println(now.String())
	// Contoh output: "Setu Pahing, 26 Ruwah 1959 Ja, Surup"

	// Gunakan tanggal tertentu
	date := tanggalan.New(time.Date(2023, 8, 17, 0, 0, 0, 0, time.UTC))
	fmt.Println(date.Dina)    // "Kemis"
	fmt.Println(date.Pasaran) // "Kliwon"
}
```

### Format Output

Anda dapat memformat output menggunakan `Format(layout)`.

```go
jd := tanggalan.New(time.Now())
fmt.Println(jd.Format("D P, dd M yyyy"))
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

Untuk dokumentasi perhitungan matematis, lihat [ALGORITHM.md](https://github.com/bect/tanggalan/blob/js/ALGORITHM.md).

### Properti

- `Dina`: string - Nama hari (misal: "Senen")
- `Pasaran`: string - Nama pasaran (misal: "Wage")
- `Wulan`: string - Nama bulan (misal: "Sura")
- `Taun`: string - Nama tahun (misal: "Ehe")
- `Wuku`: string - Nama wuku
- `Mongso`: string - Nama mongso
- `Wektu`: string - Waktu hari

### Metode

- `Date() int`: Mengembalikan tanggal Jawa.
- `Day() int`: Mengembalikan indeks hari (0=Minggu, 6=Setu).
- `Month() int`: Mengembalikan indeks bulan (0=Sura).
- `Year() int`: Mengembalikan tahun Jawa.
- `GetPasaran() int`: Mengembalikan indeks pasaran.
- `GetNeptu() int`: Mengembalikan total nilai neptu.
- `GetWuku() int`: Mengembalikan indeks wuku.
- `GetGregorianDate() time.Time`: Mengembalikan objek `time.Time` native.
- `IsKabisat() bool`: Mengembalikan `true` jika tahun kabisat.
- `Format(layout string) string`: Mengembalikan string terformat sesuai pola.
- `WetonSabanjure(weton string) (*Tanggalan, error)`: Mengembalikan instance Tanggalan untuk weton berikutnya.
- `Parse(value, layout string) (*Tanggalan, error)`: (Fungsi) Membuat instance dari string.

## Referensi

- [PRANOTO MONGSO (Penentuan Musim)](https://niagakita.id/2019/05/08/pranoto-mongso-penentuan-musim/)
- [Tanggalan Jawa](https://tanggalanjawa.com/)
- [Sejarah Kalender Jawa dan Fungsi Kegunaan](https://percetakanku.co.id/sejarah-kalender-jawa-dan-fungsi-kegunaan/)
- [Arane Wektu: Penyebutan Istilah Waktu dalam Bahasa Jawa](https://yogyakarta.kompas.com/read/2023/11/05/195150778/arane-wektu-penyebutan-istilah-waktu-dalam-bahasa-jawa?page=all)
- [Penanggalan Jawa atau Kalender Jawa](https://www.nanokaryamandiri.com/campuran/penanggalan-jawa-atau-kalender-jawa)