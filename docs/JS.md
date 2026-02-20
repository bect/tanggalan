# Dokumentasi Penggunaan JavaScript / TypeScript

Pustaka `tanggalan` menyediakan binding WebAssembly untuk perhitungan kalender Jawa, mendukung Node.js dan Browser.

## Instalasi

Instal paket menggunakan npm:

```bash
npm install @bect/tanggalan
```

## Penggunaan

### Node.js (CommonJS)

Di lingkungan Node.js, WebAssembly dimuat secara sinkron.

```javascript
const { Tanggalan } = require('@bect/tanggalan');

// 1. Tanggal Saat Ini
const now = new Tanggalan();
console.log(`Sekarang: ${now.toString()}`);

// 2. Tanggal Tertentu (17 Agustus 1945)
// Bulan di JS Date dimulai dari 0 (Januari = 0)
const merdeka = new Date(1945, 7, 17);
const jd = new Tanggalan(merdeka);

console.log(jd.toString());
// Output: Jemuah Legi, 9 Pasa 1876 Ja, Lingsir Wengi
```

### Browser / Bundler (ES Modules)

Di lingkungan web, Anda perlu menginisialisasi modul WebAssembly terlebih dahulu karena dimuat secara asinkron.

```javascript
import init, { Tanggalan } from '@bect/tanggalan';

async function main() {
    // Inisialisasi WASM (wajib dilakukan sekali)
    await init();

    const now = new Tanggalan();
    console.log(now.toString());
}

main();
```

## API Dasar

Kelas utama adalah `Tanggalan`.

### Constructor

```javascript
// Waktu saat ini
const now = new Tanggalan();

// Dari objek Date JavaScript
const date = new Tanggalan(new Date("2023-08-17"));

// Dari timestamp (milliseconds)
const ts = new Tanggalan(1692248400000);
```

### Akses Properti

```javascript
const jd = new Tanggalan();

console.log(`Dina: ${jd.dina}`);       // Jemuah
console.log(`Pasaran: ${jd.pasaran}`); // Legi
console.log(`Wuku: ${jd.wuku}`);       // Manahil
console.log(`Neptu: ${jd.getNeptu()}`); // 11
```

> **Catatan:** Beberapa properti diakses langsung (getter), beberapa menggunakan method `get...()` tergantung pada binding WASM.

## Parsing String

Anda dapat membuat objek `Tanggalan` dari string tanggal Jawa.

```javascript
try {
    const input = "28 Jumadilawal 1955";
    const fmt = "d M yyyy";
    
    const jd = Tanggalan.fromString(input, fmt);
    console.log(`Berhasil parse: ${jd.toString()}`);
} catch (e) {
    console.error(`Error: ${e}`);
}
```

## Formatting

Gunakan method `formatString` untuk memformat output.

```javascript
const pattern = "Dina: D, Pasaran: P, Mongso: MS";
console.log(jd.formatString(pattern));
// Output: Dina: Jemuah, Pasaran: Legi, Mongso: Karo
```

### Token Format

Berikut adalah daftar token yang dapat digunakan:

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
| `Z` | Timezone Offset | +0700 |

## Fitur Lanjutan

### Mencari Weton Berikutnya (`wetonSabanjure`)

Mencari tanggal terdekat di masa depan yang memiliki kombinasi Dina dan Pasaran tertentu.

```javascript
try {
    const nextWeton = jd.wetonSabanjure("Senen Legi");
    console.log(`Senen Legi berikutnya: ${nextWeton.toString()}`);
} catch (e) {
    console.error(e);
}
```

### Cek Tahun Kabisat (`isKabisat`)

```javascript
if (jd.isKabisat()) {
    console.log(`Tahun ${jd.getFullYear()} adalah tahun kabisat (355 hari)`);
} else {
    console.log(`Tahun ${jd.getFullYear()} adalah tahun basit (354 hari)`);
}
```

## Referensi API

### Class `Tanggalan`

#### Static Methods
- `fromString(input: string, format: string): Tanggalan`

#### Properties (Getters)
- `dina`: string
- `pasaran`: string
- `wulan`: string
- `taun`: string
- `wuku`: string
- `mongso`: string
- `wektu`: string

#### Methods
- `getDate(): number` (Tanggal Jawa)
- `getDay(): number` (Index Hari 0-6)
- `getMonth(): number` (Index Bulan 0-11)
- `getFullYear(): number` (Tahun Jawa)
- `getPasaran(): number` (Index Pasaran 0-4)
- `getNeptu(): number`
- `getWuku(): number` (Index Wuku 0-29)
- `getGregorianDate(): Date` (Konversi balik ke JS Date)
- `isKabisat(): boolean`
- `wetonSabanjure(weton: string): Tanggalan`
- `formatString(pattern: string): string`
- `toString(): string`