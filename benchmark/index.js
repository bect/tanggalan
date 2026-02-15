const Tanggalan = require('../lib/tanggalan');

console.log("Starting Benchmark: Generating 365 Tanggalan objects (1 Year)...");

const startDate = new Date(2022, 0, 1);
const start = process.hrtime.bigint();

for (let i = 0; i < 365; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    new Tanggalan(d);
}

const end = process.hrtime.bigint();
const duration = Number(end - start) / 1e6; // Convert nanoseconds to milliseconds

console.log(`Time taken: ${duration.toFixed(4)} ms`);
console.log(`Average per object: ${(duration / 365).toFixed(4)} ms`);

const baseline = 1.7349; // Initial benchmark result
console.log(`\n--- Comparison ---`);
console.log(`Baseline:   ${baseline.toFixed(4)} ms`);
const diff = duration - baseline;
const sign = diff > 0 ? "+" : "";
console.log(`Difference: ${sign}${diff.toFixed(4)} ms (${sign}${((diff / baseline) * 100).toFixed(2)}%)`);