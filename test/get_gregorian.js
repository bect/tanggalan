const Tanggalan = require('../lib/tanggalan');
const assert = require('assert');

console.log("Running getGregorianDate Tests...");

try {
    // 1 Jan 2022
    const t = new Tanggalan(new Date(2022, 0, 1));
    const g = t.getGregorianDate();
    
    assert.ok(g instanceof Date);
    assert.strictEqual(g.getFullYear(), 2022);
    assert.strictEqual(g.getMonth(), 0);
    assert.strictEqual(g.getDate(), 1);
    
    // Ensure it's a copy
    g.setFullYear(2023);
    assert.strictEqual(t.getGregorianDate().getFullYear(), 2022);
    
    console.log("✓ getGregorianDate returned correct Date object");
} catch (e) {
    console.error("✗ Failed getGregorianDate:", e.message);
    process.exit(1);
}