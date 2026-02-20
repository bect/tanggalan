/// Static constants for Tanggalan
/// Ported from tanggalan.js

pub const PASARAN: [&str; 5] = ["Legi", "Pahing", "Pon", "Wage", "Kliwon"];
pub const DINA: [&str; 7] = ["Minggu", "Senen", "Selasa", "Rebo", "Kemis", "Jemuah", "Setu"];
pub const WULAN: [&str; 12] = [
    "Sura", "Sapar", "Mulud", "Bakda Mulud", "Jumadilawal",
    "Jumadilakir", "Rejeb", "Ruwah", "Pasa", "Sawal", "Sela", "Besar"
];
pub const TAUN: [&str; 8] = ["Alip", "Ehe", "Jimawal", "Je", "Dal", "Be", "Wawu", "Jimakir"];
pub const WUKU: [&str; 30] = [
    "Sinta", "Landep", "Wukir", "Kurantil", "Tolu",
    "Gumbreg", "Warigalit", "Warigagung", "Julungwangi", "Sungsang",
    "Galungan", "Kuningan", "Langkir", "Mandasiya", "Julungpujut",
    "Pahang", "Kuruwelut", "Marakeh", "Tambir", "Medangkungan",
    "Maktal", "Wuye", "Manahil", "Prangbakat", "Bala",
    "Wugu", "Wayang", "Kulawu", "Dukut", "Watugunung"
];
pub const MONGSO: [&str; 12] = [
    "Kasa", "Karo", "Katelu", "Kapat", "Kalima", "Kanem",
    "Kapitu", "Kawolu", "Kasanga", "Kasadasa", "Desta", "Sada"
];

pub const NEPTU_DINA: [u8; 7] = [5, 4, 3, 7, 8, 6, 9];
pub const NEPTU_PASARAN: [u8; 5] = [5, 9, 7, 4, 8];

pub struct AnchorData {
    pub masehi_year: i32,
    pub masehi_month: u32,
    pub masehi_day: u32,
    pub taun_jawa: i32,
    pub hari_ke: i32,
    pub pola_windu: [i32; 8],
}

// Anchor: 1 Jan 2022
pub const ANCHOR: AnchorData = AnchorData {
    masehi_year: 2022,
    masehi_month: 1,
    masehi_day: 1,
    taun_jawa: 1955,
    hari_ke: 146,
    pola_windu: [355, 354, 355, 354, 354, 354, 354, 355],
};