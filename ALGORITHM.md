# Algoritma Perhitungan Kalender Jawa

Dokumen ini menjelaskan logika matematis yang digunakan dalam library `Tanggalan` untuk mengkonversi tanggal Masehi (Gregorian) ke tanggal Jawa (Saka/Lunar).

## Konsep Dasar: Titik Tolak (Anchor)

Library ini menggunakan metode **Titik Tolak (Anchor)** untuk menetapkan satu tanggal pasti di mana semua parameter Jawa sudah diketahui, kemudian menghitung tanggal lain berdasarkan selisih hari dari titik tersebut.

**Data Anchor (Titik Referensi):**
- **Masehi**: 1 Januari 2022
- **Jawa**: 28 Jumadilawal 1955 Ja
- **Tahun**: Alip (Index Windu 0)
- **Hari ke-**: 146 (dalam tahun 1955)
- **Pasaran**: Pahing
- **Wuku**: Marakeh

## 1. Pasaran

Siklus Pasaran terdiri dari 5 hari: *Legi, Pahing, Pon, Wage, Kliwon*.
Rumus:
```javascript
Index = (IndexAnchor + SelisihHari) % 5
```
Dimana `IndexAnchor` untuk Pahing adalah 1.

## 2. Wuku

Siklus Wuku terdiri dari 30 minggu (210 hari).
Rumus:
```javascript
MingguKe = Floor((SelisihHari + OffsetHari) / 7)
IndexWuku = (IndexAnchor + MingguKe) % 30
```

## 3. Tahun dan Bulan (Sistem Windu)

Kalender Jawa Sultan Agungan menggunakan siklus 8 tahun (Windu).
Urutan tahun dalam satu Windu yang digunakan:
1. **Alip** (355 hari) - Kabisat
2. **Ehe** (354 hari)
3. **Jimawal** (355 hari) - Kabisat
4. **Je** (354 hari)
5. **Dal** (354 hari)
6. **Be** (354 hari)
7. **Wawu** (354 hari)
8. **Jimakir** (355 hari) - Kabisat

Algoritma berjalan dengan mengurangi `TotalHari` dengan panjang tahun secara berurutan hingga sisa hari muat dalam satu tahun.

### Penentuan Bulan
Setelah tahun diketahui, sisa hari digunakan untuk menentukan bulan.
- Bulan 1, 3, 5, 7, 9, 11: **30 Hari**
- Bulan 2, 4, 6, 8, 10: **29 Hari**
- Bulan 12 (Besar): **29 Hari** (Basit) atau **30 Hari** (Kabisat)

## 4. Mongso (Solar)

Mongso dihitung berdasarkan posisi tanggal Masehi dalam satu tahun (Solar Calendar), tidak bergantung pada tahun Jawa (Lunar).

| Mongso | Rentang (Approx) |
| :--- | :--- |
| Kasa | 22 Jun - 1 Agt |
| Karo | 2 Agt - 24 Agt |
| Katelu | 25 Agt - 17 Sep |
| Kapat | 18 Sep - 12 Okt |
| Kalima | 13 Okt - 8 Nov |
| Kanem | 9 Nov - 21 Des |
| Kapitu | 22 Des - 2 Feb |
| Kawolu | 3 Feb - 29 Feb |
| Kasanga | 1 Mar - 25 Mar |
| Kasadasa | 26 Mar - 18 Apr |
| Desta | 19 Apr - 11 Mei |
| Sada | 12 Mei - 21 Jun |

## 5. Wektu

Wektu adalah pembagian waktu tradisional berdasarkan jam lokal (misal: **Surup** pada 17:30 - 18:30).

## 6. Kurup

Kurup adalah siklus global kalender Jawa yang berdurasi sekitar 120 tahun (15 Windu). Kurup menentukan hari pasaran awal untuk tahun Alip pada periode tersebut.

Saat ini (mulai 24 Maret 1936 M / 1 Sura 1867 Ja), kita berada dalam **Kurup Asapon** (Alip Selasa Pon). Artinya, setiap tahun Alip dalam periode ini idealnya dimulai pada hari Selasa Pon.

Kurup sebelumnya:
- **Kurup Aboge** (Alip Rebo Wage): 1749 - 1936 M

## Referensi

- [Cara Menghitung Kalender Jawa Weton](https://kumparan.com/berita-terkini/cara-menghitung-kalender-jawa-weton-1usgHhsjVC0/full)
- [Sejarah Kalender Jawa dan Fungsi Kegunaan](https://percetakanku.co.id/sejarah-kalender-jawa-dan-fungsi-kegunaan/)
- [Arane Wektu: Penyebutan Istilah Waktu dalam Bahasa Jawa](https://yogyakarta.kompas.com/read/2023/11/05/195150778/arane-wektu-penyebutan-istilah-waktu-dalam-bahasa-jawa?page=all)
- [Penanggalan Jawa atau Kalender Jawa](https://www.nanokaryamandiri.com/campuran/penanggalan-jawa-atau-kalender-jawa)
- [Tanggalan Jawa](https://tanggalanjawa.com/)