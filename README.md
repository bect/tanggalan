# Tanggalan

Pustaka `tanggalan` menyediakan binding Python untuk perhitungan kalender Jawa (ditulis dengan Rust).

## Instalasi

Instal paket menggunakan pip:

```bash
pip install tanggalan
```

## Penggunaan Dasar

Kelas utama adalah `Tanggalan`.

```python
from tanggalan import Tanggalan
from datetime import datetime

# 1. Tanggal Saat Ini
now = Tanggalan()
print(f"Sekarang: {now}")
# Output: Sekarang: Jemuah Legi, 9 Pasa 1876 Ja, Lingsir Wengi (contoh)

# 2. Tanggal Tertentu (17 Agustus 1945)
# Gunakan datetime standar Python
merdeka = datetime(1945, 8, 17, 10, 0, 0)
jd = Tanggalan(merdeka)

# 3. Akses Properti
print(f"Dina: {jd.dina}")       # Jemuah
print(f"Pasaran: {jd.pasaran}") # Legi
print(f"Wuku: {jd.wuku}")       # Manahil
print(f"Neptu: {jd.neptu}")     # 11 (Jemuah 6 + Legi 5)

# Output default (__str__)
print(jd) 
# Output: Jemuah Legi, 9 Pasa 1876 Ja, Lingsir Wengi
```

## Parsing String

Anda dapat membuat objek `Tanggalan` dari string tanggal Jawa.

```python
from tanggalan import Tanggalan

input_str = "28 Jumadilawal 1955"
fmt = "d M yyyy"

try:
    jd = Tanggalan.from_string(input_str, fmt)
    print(f"Berhasil parse: {jd}")
    print(f"Weton: {jd.dina} {jd.pasaran}")
except ValueError as e:
    print(f"Error: {e}")
```

## Formatting

Gunakan method `format_string` untuk memformat output sesuai kebutuhan.

```python
pattern = "Dina: D, Pasaran: P, Mongso: MS"
print(jd.format_string(pattern))
# Output: Dina: Jemuah, Pasaran: Legi, Mongso: Karo
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

```python
try:
    next_weton = jd.weton_sabanjure("Senen Legi")
    print(f"Senen Legi berikutnya: {next_weton}")
except ValueError as e:
    print(f"Error: {e}")
```

### Cek Tahun Kabisat (`is_kabisat`)

```python
if jd.is_kabisat():
    print(f"Tahun {jd.year} adalah tahun kabisat (355 hari)")
else:
    print(f"Tahun {jd.year} adalah tahun basit (354 hari)")
```

## Referensi API

### Class `Tanggalan`

#### Static Methods

- **`from_string(input: str, format: str) -> Tanggalan`**: Membuat instance dari string tanggal Jawa.

#### Properties (String)

| Properti | Tipe | Deskripsi |
| :--- | :--- | :--- |
| `dina` | `str` | Nama hari (misal: "Senen") |
| `pasaran` | `str` | Nama pasaran (misal: "Wage") |
| `wulan` | `str` | Nama bulan (misal: "Sura") |
| `taun` | `str` | Nama tahun (misal: "Ehe") |
| `wuku` | `str` | Nama wuku |
| `mongso` | `str` | Nama mongso |
| `wektu` | `str` | Waktu hari (misal: "Surup") |

#### Methods

- **`get_date() -> int`**: Tanggal Jawa (1-30).
- **`get_day() -> int`**: Indeks hari (0=Minggu, 6=Setu).
- **`get_month() -> int`**: Indeks bulan (0=Sura).
- **`get_full_year() -> int`**: Tahun Jawa.
- **`get_pasaran() -> int`**: Indeks pasaran (0=Legi).
- **`get_neptu() -> int`**: Total nilai neptu.
- **`get_wuku() -> int`**: Indeks wuku (0=Sinta).
- **`get_mongso() -> int`**: Indeks mongso (0=Kasa).
- **`get_wektu() -> str`**: Waktu hari (misal: "Surup").
- **`get_gregorian_date() -> datetime`**: Mengembalikan objek `datetime` native.
- **`is_kabisat() -> bool`**: Mengecek apakah tahun Jawa saat ini adalah tahun kabisat (355 hari).
- **`weton_sabanjure(weton: str) -> Tanggalan`**: Mencari tanggal terjadinya weton tertentu di masa depan.
- **`format_string(pattern: str) -> str`**: Memformat tanggal menjadi string menggunakan token.
- **`__str__() -> str`**: Representasi string default.

## Referensi

- [PRANOTO MONGSO (Penentuan Musim)](https://niagakita.id/2019/05/08/pranoto-mongso-penentuan-musim/)
- [Tanggalan Jawa](https://tanggalanjawa.com/)
- [Sejarah Kalender Jawa dan Fungsi Kegunaan](https://percetakanku.co.id/sejarah-kalender-jawa-dan-fungsi-kegunaan/)
- [Arane Wektu: Penyebutan Istilah Waktu dalam Bahasa Jawa](https://yogyakarta.kompas.com/read/2023/11/05/195150778/arane-wektu-penyebutan-istilah-waktu-dalam-bahasa-jawa?page=all)
- [Penanggalan Jawa atau Kalender Jawa](https://www.nanokaryamandiri.com/campuran/penanggalan-jawa-atau-kalender-jawa)