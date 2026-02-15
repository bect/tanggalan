const Tanggalan = require('../lib/tanggalan');

const testCases = [
    // Note: The expected output corresponds to Jan 1st of the following year.
    // We use local time (new Date(y, m, d)) to ensure timezone safety.
    { label: '2022-01-01', dateArgs: [2022, 0, 1], expected: 'Setu Pahing, 28 Jumadilawal 1955 Ja, Alip, Wuku Marakeh' },
    { label: '2023-01-01', dateArgs: [2023, 0, 1], expected: 'Minggu Pahing, 8 Jumadilakir 1956 Ja, Ehe, Wuku Galungan' },
    { label: '2024-01-01', dateArgs: [2024, 0, 1], expected: 'Senen Pahing, 19 Jumadilakir 1957 Ja, Jimawal, Wuku Wukir' },
    { label: '2025-01-01', dateArgs: [2025, 0, 1], expected: 'Rebo Pon, 1 Rejeb 1958 Ja, Je, Wuku Bala' },
    { label: '2026-01-01', dateArgs: [2026, 0, 1], expected: 'Kemis Pon, 12 Rejeb 1959 Ja, Dal, Wuku Kuruwelut' },
    { label: '2027-01-01', dateArgs: [2027, 0, 1], expected: 'Jemuah Pon, 23 Rejeb 1960 Ja, Be, Wuku Julungwangi' },
    { label: '2028-01-01', dateArgs: [2028, 0, 1], expected: 'Setu Pon, 4 Ruwah 1961 Ja, Wawu, Wuku Sinta' },
    { label: '2029-01-01', dateArgs: [2029, 0, 1], expected: 'Senen Wage, 16 Ruwah 1962 Ja, Jimakir, Wuku Prangbakat' }
];

testCases.forEach(tc => {
    const jd = new Tanggalan(new Date(...tc.dateArgs));
    const output = `${jd.dina} ${jd.pasaran}, ${jd.getDate()} ${jd.wulan} ${jd.getFullYear()} Ja, ${jd.taun}, Wuku ${jd.wuku}`;

    if (output === tc.expected) {
        console.log(`[${tc.label}] ✅ PASS\n   Output: ${output}`);
    } else {
        console.error(`[${tc.label}] ❌ FAIL\n   Expected: ${tc.expected}\n   Actual:   ${output}`);
        process.exit(1);
    }
    console.log('-------------------------');
});