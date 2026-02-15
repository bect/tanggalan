import Tanggalan from '../../../lib/tanggalan.js';

export const MONTH_NAMES = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

// Standard Indonesian Day Names
export const DAYS_HEADER = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

export function getJavaneseDate(date) {
    return new Tanggalan(date);
}