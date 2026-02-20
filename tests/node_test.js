const { Tanggalan } = require('../pkg/node/tanggalan.js');
const assert = require('assert');

console.log("🚀 Starting Tanggalan Node.js Tests...");

try {
    // 1. Test Default Constructor
    const now = new Tanggalan();
    console.log(`1. Current Date: ${now.toString()}`);
    assert.ok(now.dina, "Dina should be defined");

    // 2. Test Specific Date (17 Aug 1945)
    // Note: JS Date months are 0-indexed (0 = Jan, 7 = Aug)
    const merdeka = new Tanggalan(new Date(1945, 7, 17, 10, 0, 0));
    console.log(`2. Independence Day: ${merdeka.toString()}`);
    
    assert.strictEqual(merdeka.dina, "Jemuah", "Expected Jemuah");
    assert.strictEqual(merdeka.pasaran, "Legi", "Expected Legi");
    assert.strictEqual(merdeka.wuku, "Manahil", "Expected Manahil");
    
    // 3. Test Formatting
    const fmt = merdeka.formatString("D P, dd M yyyy");
    assert.strictEqual(fmt, "Jemuah Legi, 09 Pasa 1876");

    console.log("✅ Node.js tests passed!");
} catch (err) {
    console.error("❌ Test Failed:");
    console.error(err);
    process.exit(1);
}