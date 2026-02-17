const Tanggalan = require('../lib/tanggalan');
const { performance } = require('perf_hooks');

const ITERATIONS = 100_000;

console.log(`\nRunning Benchmarks (${ITERATIONS.toLocaleString()} iterations per task)`);
if (!global.gc) {
    console.log("Tip: Run with 'node --expose-gc benchmark/index.js' for more accurate memory isolation.");
}
console.log('='.repeat(65));

function runBenchmark(label, fn) {
    // Warmup
    try {
        for(let i=0; i<100; i++) fn();
    } catch(e) { console.error(e); return; }

    if (global.gc) global.gc();
    const startHeap = process.memoryUsage().heapUsed;

    const start = performance.now();
    for (let i = 0; i < ITERATIONS; i++) {
        fn();
    }
    const end = performance.now();
    const endHeap = process.memoryUsage().heapUsed;
    
    const duration = end - start;
    const ops = Math.floor(ITERATIONS / (duration / 1000));
    const heapDiff = (endHeap - startHeap) / 1024; // KB
    
    console.log(`Task    : ${label}`);
    console.log(`Duration: ${duration.toFixed(2)} ms`);
    console.log(`Speed   : ${ops.toLocaleString()} ops/sec`);
    console.log(`Heap Δ  : ${heapDiff.toFixed(2)} KB`);
    console.log('-'.repeat(65));
}

// 1. Object Creation (The Core Algorithm)
runBenchmark("Constructor: new Tanggalan()", () => {
    new Tanggalan();
});

// 2. Formatting
const t = new Tanggalan();
runBenchmark("Format: Complex Pattern", () => {
    t.formatString("D P, dd M yyyy Ja, T, Wuku W, N, MS, WK, HH:MM:SS Z");
});

// 3. Parsing (Regex + Reverse Calculation)
runBenchmark("Parse: fromString", () => {
    Tanggalan.fromString("28 Jumadilawal 1955", "d M yyyy");
});

// 4. Calculation (Looping)
runBenchmark("Calc: wetonSabanjure", () => {
    t.wetonSabanjure("Senen Legi");
});

// 5. Leap Year Check (Arithmetic)
runBenchmark("Check: isKabisat", () => {
    t.isKabisat();
});