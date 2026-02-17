const Tanggalan = require('../lib/tanggalan');
const assert = require('assert');

console.log("Running Next Weton Tests...");

try {
    // Start Date: 1 Jan 2022 (Setu Pahing)
    const start = new Date(2022, 0, 1);
    const t = new Tanggalan(start);
    
    // Case 1: Find next "Senen Legi"
    // Setu Pahing (Sat) -> Senen Legi (Mon)
    // 1 Jan 2022 + 9 days = 10 Jan 2022.
    const next = t.wetonSabanjure("Senen Legi");
    
    assert.strictEqual(next.dina, "Senen");
    assert.strictEqual(next.pasaran, "Legi");
    
    // Verify Gregorian Date (10 Jan 2022)
    const greg = next.getGregorianDate();
    assert.strictEqual(greg.getDate(), 10);
    assert.strictEqual(greg.getMonth(), 0); // Jan
    
    assert.strictEqual(next.getFullYear(), 1955); // Javanese Year
    
    // Case 2: Find next "Setu Pahing" (Same as start)
    // Should return 35 days later (Selapan)
    const nextSame = t.wetonSabanjure("Setu Pahing");
    
    // Normalize start to noon because wetonSabanjure returns dates at noon
    const startNoon = new Date(start);
    startNoon.setHours(12, 0, 0, 0);
    
    const diffTime = nextSame.getGregorianDate() - startNoon;
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    assert.strictEqual(diffDays, 35);

    console.log("✓ Next Weton calculated correctly");
} catch (e) {
    console.error("✗ Failed next weton calculation:", e.message);
    process.exit(1);
}