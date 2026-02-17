const Tanggalan = require('../lib/tanggalan');
const assert = require('assert');

console.log("Running Kabisat Tests...");

// Test 1: 1955 Ja (Alip)
// Based on the library's anchor pattern, 1955 is index 0 of polaWindu [355, ...].
// So it should be Kabisat.
try {
    const t = new Tanggalan(new Date(2022, 0, 1)); // 28 Jumadilawal 1955
    assert.strictEqual(t.getFullYear(), 1955);
    assert.strictEqual(t.isKabisat(), true);
    console.log("✓ 1955 Ja is Kabisat");
} catch (e) {
    console.error("✗ Failed 1955 check:", e.message);
    process.exit(1);
}

// Test 2: 1956 Ja (Ehe)
// Index 1 of polaWindu is 354. Should not be Kabisat.
try {
    const t = new Tanggalan(new Date(2023, 0, 1)); // 8 Jumadilakir 1956
    assert.strictEqual(t.getFullYear(), 1956);
    assert.strictEqual(t.isKabisat(), false);
    console.log("✓ 1956 Ja is not Kabisat");
} catch (e) {
    console.error("✗ Failed 1956 check:", e.message);
    process.exit(1);
}