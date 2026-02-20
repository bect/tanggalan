import init, { Tanggalan } from '../../pkg/web/tanggalan.js';

async function runDemos() {
    try {
        await init();
    } catch (e) {
        document.querySelectorAll('.output').forEach(el => el.innerHTML = "Error: Library not loaded.");
        return;
    }

    const runDemo = (id, fn) => {
        try { 
            const el = document.getElementById(id);
            if (el) el.innerText = "> " + fn(); 
        } 
        catch(e) { 
            const el = document.getElementById(id);
            if (el) el.innerText = "Error: " + e.message; 
        }
    };

    runDemo('demo1', () => new Tanggalan().toString());
    
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth();
    const d = now.getDate();
    document.getElementById('code_manual').innerText = `const Tanggalan = require('@bect/tanggalan');\n\nconst specific = new Tanggalan(new Date(${y}, ${m}, ${d}));\nconsole.log(specific.toString());`;
    runDemo('demo_manual', () => new Tanggalan(new Date(y, m, d)).toString());
    
    runDemo('demo2', () => Tanggalan.fromString("28 Jumadilawal 1955", "d M yyyy").getGregorianDate().toDateString());
    runDemo('demo3', () => new Tanggalan().wetonSabanjure("Senen Legi").toString());
    runDemo('demo4', () => new Tanggalan().formatString("Dina: D, Pasaran: P, Mongso: MS"));
}
runDemos();