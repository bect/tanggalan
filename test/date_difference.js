const Tanggalan = require('../lib/tanggalan');
const assert = require('assert');

console.log("Running Date Difference Tests...");

try {
    // Date 1: 1 Jan 2022
    const t1 = new Tanggalan(new Date(2022, 0, 1));
    
    // Date 2: 11 Jan 2022
    const t2 = new Tanggalan(new Date(2022, 0, 11));

    const d1 = t1.getGregorianDate();
    const d2 = t2.getGregorianDate();

    // Calculate difference in milliseconds
    const diffTime = Math.abs(d2 - d1);
    // Convert to days (1000ms * 60s * 60m * 24h)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

    assert.strictEqual(diffDays, 10);
    console.log(`✓ Difference between ${t1.toString()} and ${t2.toString()} is ${diffDays} days`);
} catch (e) {
    console.error("✗ Failed date difference calculation:", e.message);
    process.exit(1);
}