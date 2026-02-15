/**
 * Tanggalan JS Library
 * A comprehensive library for Javanese Calendar conversion.
 * Features: Weton, Wuku, Neptu, Mongso (Solar), and Traditional Time.
 * * Base Anchor: 1 Jan 2022
 */
class Tanggalan {
    // --- STATIC CONSTANTS ---
    static PASARAN = ["Legi", "Pahing", "Pon", "Wage", "Kliwon"];
    static DINA = ["Minggu", "Senen", "Selasa", "Rebo", "Kemis", "Jemuah", "Setu"];
    static WULAN = [
        "Sura", "Sapar", "Mulud", "Bakda Mulud", "Jumadilawal",
        "Jumadilakir", "Rejeb", "Ruwah", "Pasa", "Sawal", "Sela", "Besar"
    ];
    static TAUN = ["Alip", "Ehe", "Jimawal", "Je", "Dal", "Be", "Wawu", "Jimakir"];
    static WUKU = [
        "Sinta", "Landep", "Wukir", "Kurantil", "Tolu",
        "Gumbreg", "Warigalit", "Warigagung", "Julungwangi", "Sungsang",
        "Galungan", "Kuningan", "Langkir", "Mandasiya", "Julungpujut",
        "Pahang", "Kuruwelut", "Marakeh", "Tambir", "Medangkungan",
        "Maktal", "Wuye", "Manahil", "Prangbakat", "Bala",
        "Wugu", "Wayang", "Kulawu", "Dukut", "Watugunung"
    ];
    static MONGSO = [
        "Kasa", "Karo", "Katelu", "Kapat", "Kalima", "Kanem",
        "Kapitu", "Kawolu", "Kasanga", "Kasadasa", "Desta", "Sada"
    ];

    static NEPTU_DINA = [5, 4, 3, 7, 8, 6, 9];
    static NEPTU_PASARAN = [5, 9, 7, 4, 8];

    // Anchor: 1 Jan 2022
    static ANCHOR = {
        masehi: new Date(2022, 0, 1),
        taunJawa: 1955,
        hariKe: 146,
        polaWindu: [355, 354, 355, 354, 354, 354, 354, 355]
    };

    /**
     * Create a new Tanggalan instance.
     * @param {Date} [date=new Date()] - The date to convert. Defaults to now.
     */
    constructor(date = new Date()) {
        // Keep native date for time getters
        this.nativeDate = new Date(date.getTime());

        const res = this._calculate(date);
        const mongso = this._calculateMongso(date);
        const wektu = this._calculateWektu(date);

        // --- PUBLIC PROPERTIES (Readable Strings) ---
        this.dina = res.dina;
        this.pasaran = res.pasaran;
        this.wulan = res.wulan;
        this.sasi = res.wulan;
        this.taun = res.namaTaun;
        this.wuku = res.wuku;
        this.mongso = mongso.nama;
        this.wektu = wektu;

        // --- PRIVATE DATA (Raw Numbers) ---
        Object.defineProperty(this, '_data', {
            value: {
                date: res.tanggal,
                dayIndex: res.hariIndex,
                pasaranIndex: res.pasaranIndex,
                monthIndex: res.bulanIndex,
                year: res.taun,
                neptu: res.neptu,
                wukuIndex: res.wukuIndex,
                mongsoIndex: mongso.index
            },
            writable: false,
            enumerable: false
        });
    }

    // --- NATIVE-LIKE GETTERS (Numbers) ---
    getDate() { return this._data.date; }
    getDay() { return this._data.dayIndex; } // 0=Minggu
    getMonth() { return this._data.monthIndex; } // 0=Sura
    getFullYear() { return this._data.year; }

    getHours() { return this.nativeDate.getHours(); }
    getMinutes() { return this.nativeDate.getMinutes(); }
    getSeconds() { return this.nativeDate.getSeconds(); }

    // --- JAVANESE SPECIFIC GETTERS ---
    getPasaran() { return this._data.pasaranIndex; }
    getNeptu() { return this._data.neptu; }
    getWuku() { return this._data.wukuIndex; }
    getMongso() { return this._data.mongsoIndex; }
    getWektu() { return this.wektu; }

    // --- FORMATTING METHODS ---

    /**
     * Returns standard string: "Setu Pahing, 26 Ruwah 1959 Ja, Surup"
     * @returns {string} The formatted string.
     */
    toString() {
        return `${this.dina} ${this.pasaran}, ${this.getDate()} ${this.wulan} ${this.getFullYear()} Ja, ${this.wektu}`;
    }

    /**
     * Format date using patterns.
     * @param {string} pattern - The format pattern string.
     * Tokens: 
     * D(DayName), P(Pasaran), d(Date), dd(01), M(MonthName), m(MonthNo), 
     * yyyy(Year), T(WinduYear), W(Wuku), N(Neptu), MS(Mongso), WK(Wektu),
     * HH(Hours), MM(Minutes), SS(Seconds)
     * @returns {string} The formatted string.
     */
    formatString(pattern) {
        const data = {
            "yyyy": this.getFullYear(),
            "MS": this.mongso,
            "mm": String(this.getMonth() + 1).padStart(2, '0'),
            "dd": String(this.getDate()).padStart(2, '0'),
            "HH": String(this.getHours()).padStart(2, '0'),
            "MM": String(this.getMinutes()).padStart(2, '0'),
            "SS": String(this.getSeconds()).padStart(2, '0'),
            "WK": this.wektu,
            "T": this.taun,
            "W": this.wuku,
            "P": this.pasaran,
            "D": this.dina,
            "M": this.wulan,
            "N": this.getNeptu(),
            "m": this.getMonth() + 1,
            "d": this.getDate()
        };

        return pattern.replace(/yyyy|MS|mm|dd|HH|MM|SS|WK|T|W|P|D|M|N|m|d/g, match => data[match]);
    }

    // --- INTERNAL LOGIC ---

    _calculateMongso(date) {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const currentVal = (month * 100) + day;

        // Logic
        let result = { nama: "Kapitu", index: 6 };

        if (currentVal >= 622 && currentVal <= 801) result = { nama: "Kasa", index: 0 };
        else if (currentVal >= 802 && currentVal <= 824) result = { nama: "Karo", index: 1 };
        else if (currentVal >= 825 && currentVal <= 917) result = { nama: "Katelu", index: 2 };
        else if (currentVal >= 918 && currentVal <= 1012) result = { nama: "Kapat", index: 3 };
        else if (currentVal >= 1013 && currentVal <= 1108) result = { nama: "Kalima", index: 4 };
        else if (currentVal >= 1109 && currentVal <= 1221) result = { nama: "Kanem", index: 5 };
        else if (currentVal >= 1222 || currentVal <= 202) result = { nama: "Kapitu", index: 6 };
        else if (currentVal >= 203 && currentVal <= 229) result = { nama: "Kawolu", index: 7 };
        else if (currentVal >= 301 && currentVal <= 325) result = { nama: "Kasanga", index: 8 };
        else if (currentVal >= 326 && currentVal <= 418) result = { nama: "Kasadasa", index: 9 };
        else if (currentVal >= 419 && currentVal <= 511) result = { nama: "Desta", index: 10 };
        else if (currentVal >= 512 && currentVal <= 621) result = { nama: "Sada", index: 11 };

        return result;
    }

    _calculateWektu(date) {
        const h = date.getHours();
        const m = date.getMinutes();
        const t = h + (m / 60);

        if (t >= 3.5 && t < 4.5) return "Fajar";
        if (t >= 4.5 && t < 5.5) return "Saput Lemah";
        if (t >= 5.5 && t < 6.5) return "Byar";
        if (t >= 6.5 && t < 9.0) return "Enjing";
        if (t >= 9.0 && t < 11.0) return "Gumatel";
        if (t >= 11.0 && t < 12.0) return "Tengange";
        if (t >= 12.0 && t < 13.0) return "Bedhug";
        if (t >= 13.0 && t < 15.0) return "Lingsir Kulon";
        if (t >= 15.0 && t < 16.5) return "Ngasar";
        if (t >= 16.5 && t < 17.5) return "Tunggang Gunung";
        if (t >= 17.5 && t < 18.5) return "Surup";
        if (t >= 18.5 && t < 19.5) return "Bakda Maghrib";
        if (t >= 19.5 && t < 21.0) return "Isya";
        if (t >= 21.0 && t < 23.0) return "Sirep Bocah";
        if (t >= 23.0 && t < 1.0) return "Tengah Wengi";
        if (t >= 1.0 && t < 3.5) return "Lingsir Wengi";
        return "Wengi";
    }

    _calculate(date) {
        const K = Tanggalan; // Self Reference
        const inputDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0);
        const anchorDate = new Date(K.ANCHOR.masehi.getFullYear(), K.ANCHOR.masehi.getMonth(), K.ANCHOR.masehi.getDate(), 12, 0, 0);
        const satuHari = 24 * 60 * 60 * 1000;
        const totalHari = Math.round((inputDate.getTime() - anchorDate.getTime()) / satuHari);

        let indexPasaran = (1 + totalHari) % 5;
        if (indexPasaran < 0) indexPasaran += 5;
        const indexHari = inputDate.getDay();
        const totalNeptu = K.NEPTU_DINA[indexHari] + K.NEPTU_PASARAN[indexPasaran];

        const wukuWeeks = Math.floor((totalHari + 6) / 7);
        let indexWuku = (17 + wukuWeeks) % 30;
        if (indexWuku < 0) indexWuku += 30;

        let hariJawaRunning = K.ANCHOR.hariKe + totalHari;
        let taunJawa = K.ANCHOR.taunJawa;
        let indexWindu = 0;

        while (true) {
            const panjangTahun = K.ANCHOR.polaWindu[indexWindu];
            if (hariJawaRunning > panjangTahun) {
                hariJawaRunning -= panjangTahun;
                taunJawa++;
                indexWindu = (indexWindu + 1) % 8;
            } else if (hariJawaRunning <= 0) {
                indexWindu = (indexWindu - 1 + 8) % 8;
                taunJawa--;
                hariJawaRunning += K.ANCHOR.polaWindu[indexWindu];
            } else { break; }
        }

        const isKabisat = (K.ANCHOR.polaWindu[indexWindu] === 355);
        const panjangBulan = [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, (isKabisat ? 30 : 29)];

        let indexBulan = 0;
        for (let i = 0; i < 12; i++) {
            if (hariJawaRunning <= panjangBulan[i]) { indexBulan = i; break; }
            hariJawaRunning -= panjangBulan[i];
        }

        return {
            tanggal: hariJawaRunning, hariIndex: indexHari, pasaranIndex: indexPasaran,
            bulanIndex: indexBulan, wukuIndex: indexWuku, wulan: K.WULAN[indexBulan],
            taun: taunJawa, namaTaun: K.TAUN[indexWindu], dina: K.DINA[indexHari],
            pasaran: K.PASARAN[indexPasaran], wuku: K.WUKU[indexWuku], neptu: totalNeptu
        };
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Tanggalan;
} else if (typeof window !== 'undefined') {
    window.Tanggalan = Tanggalan;
}