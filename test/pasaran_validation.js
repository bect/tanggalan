const Tanggalan = require('../lib/tanggalan');
const assert = require('assert');

console.log("Running Pasaran Validation Tests...");

// Test 1: Valid Date and Pasaran
// 1 Jan 2022 is 28 Jumadilawal 1955 Ja, which is Setu Pahing.
try {
    const t = Tanggalan.fromString("28 Jumadilawal 1955 Pahing", "d M yyyy P");
    assert.strictEqual(t.pasaran, "Pahing");
    assert.strictEqual(t.dina, "Setu");
    console.log("✓ Valid Pasaran parsed successfully");
} catch (e) {
    console.error("✗ Failed to parse valid Pasaran:", e.message);
    process.exit(1);
}

// Test 2: Invalid Pasaran
// We try to claim it is "Legi", but it is actually "Pahing".
try {
    Tanggalan.fromString("28 Jumadilawal 1955 Legi", "d M yyyy P");
    console.error("✗ Should have thrown error for invalid Pasaran");
    process.exit(1);
} catch (e) {
    if (e.message.includes("jatuh pada Pahing, bukan Legi")) {
        console.log("✓ Correctly rejected invalid Pasaran");
    } else {
        console.error("✗ Threw unexpected error:", e.message);
        process.exit(1);
    }
}

// Test 3: Input without Pasaran
// We provide a date without the Pasaran, and a format string without 'P'.
// The library should calculate the Pasaran automatically.
try {
    const t = Tanggalan.fromString("28 Jumadilawal 1955", "d M yyyy");
    assert.strictEqual(t.pasaran, "Pahing");
    console.log("✓ Input without Pasaran parsed successfully (Calculated: " + t.pasaran + ")");
} catch (e) {
    console.error("✗ Failed to parse input without Pasaran:", e.message);
    process.exit(1);
}

// Test 4: Time parsing
// We provide a date with time components.
try {
    const t = Tanggalan.fromString("28 Jumadilawal 1955 14:30:00", "d M yyyy HH:MM:SS");
    assert.strictEqual(t.getHours(), 14);
    assert.strictEqual(t.getMinutes(), 30);
    assert.strictEqual(t.getSeconds(), 0);
    console.log("✓ Time parsed successfully (" + t.formatString("HH:MM:SS") + ")");
} catch (e) {
    console.error("✗ Failed to parse time:", e.message);
    process.exit(1);
}

// Test 5: Timezone parsing
// 12:00:00 +0700 (WIB) should be 05:00:00 UTC
try {
    const t = Tanggalan.fromString("28 Jumadilawal 1955 12:00:00 +0700", "d M yyyy HH:MM:SS Z");
    // 28 Jumadilawal 1955 is 1 Jan 2022
    const expectedISO = "2022-01-01T05:00:00.000Z";
    assert.strictEqual(t.nativeDate.toISOString(), expectedISO);
    console.log("✓ Timezone parsed successfully (" + t.nativeDate.toISOString() + ")");
} catch (e) {
    console.error("✗ Failed to parse timezone:", e.message);
    process.exit(1);
}

// Test 6: Format with Timezone
try {
    const t = new Tanggalan();
    const formatted = t.formatString("Z");
    // Basic validation that it matches +/-HHMM
    if (!/^[+-]\d{4}$/.test(formatted)) {
        throw new Error(`Invalid timezone format: ${formatted}`);
    }
    console.log("✓ Format with timezone successful (" + formatted + ")");
} catch (e) {
    console.error("✗ Failed to format timezone:", e.message);
    process.exit(1);
}

// Test 7: Word Boundary Check
// Verify that words containing tokens (e.g., "Day" contains "D") are NOT replaced.
try {
    const t = new Tanggalan();
    // "Day" should remain "Day". "D" should become the day name (e.g., "Setu").
    const pattern = "Day: D, Month: M";
    const formatted = t.formatString(pattern);
    
    const expected = `Day: ${t.dina}, Month: ${t.wulan}`;
    
    if (formatted !== expected) {
        throw new Error(`Expected "${expected}", got "${formatted}"`);
    }
    console.log(`✓ Word boundary check successful ("${pattern}" -> "${formatted}")`);
} catch (e) {
    console.error("✗ Failed word boundary check:", e.message);
    process.exit(1);
}