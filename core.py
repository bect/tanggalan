from datetime import datetime, timedelta
import re

class Tanggalan:
    # --- STATIC CONSTANTS ---
    PASARAN = ["Legi", "Pahing", "Pon", "Wage", "Kliwon"]
    DINA = ["Minggu", "Senen", "Selasa", "Rebo", "Kemis", "Jemuah", "Setu"]
    WULAN = [
        "Sura", "Sapar", "Mulud", "Bakda Mulud", "Jumadilawal",
        "Jumadilakir", "Rejeb", "Ruwah", "Pasa", "Sawal", "Sela", "Besar"
    ]
    TAUN = ["Alip", "Ehe", "Jimawal", "Je", "Dal", "Be", "Wawu", "Jimakir"]
    WUKU = [
        "Sinta", "Landep", "Wukir", "Kurantil", "Tolu",
        "Gumbreg", "Warigalit", "Warigagung", "Julungwangi", "Sungsang",
        "Galungan", "Kuningan", "Langkir", "Mandasiya", "Julungpujut",
        "Pahang", "Kuruwelut", "Marakeh", "Tambir", "Medangkungan",
        "Maktal", "Wuye", "Manahil", "Prangbakat", "Bala",
        "Wugu", "Wayang", "Kulawu", "Dukut", "Watugunung"
    ]
    MONGSO = [
        "Kasa", "Karo", "Katelu", "Kapat", "Kalima", "Kanem",
        "Kapitu", "Kawolu", "Kasanga", "Kasadasa", "Desta", "Sada"
    ]

    NEPTU_DINA = [5, 4, 3, 7, 8, 6, 9]
    NEPTU_PASARAN = [5, 9, 7, 4, 8]

    # Anchor: 1 Jan 2022
    ANCHOR = {
        "masehi": datetime(2022, 1, 1, 12, 0, 0),
        "taunJawa": 1955,
        "hariKe": 146,
        "polaWindu": [355, 354, 355, 354, 354, 354, 354, 355]
    }

    def __init__(self, date_input=None):
        if date_input is None:
            self.native_date = datetime.now()
        else:
            self.native_date = date_input
            
        res = self._calculate(self.native_date)
        mongso = self._calculateMongso(self.native_date)
        wektu = self._calculateWektu(self.native_date)
        
        # --- PUBLIC PROPERTIES ---
        self.dina = res['dina']
        self.pasaran = res['pasaran']
        self.wulan = res['wulan']
        self.sasi = res['wulan'] # Alias for wulan
        self.taun = res['namaTaun']
        self.wuku = res['wuku']
        self.mongso = mongso['nama']
        self.wektu = wektu
        self.neptu = res['neptu']
        
        # --- PRIVATE/RAW DATA ---
        self.date = res['tanggal']
        self.year = res['taun']
        self.day_index = res['hariIndex']
        self.month_index = res['bulanIndex']
        self.pasaran_index = res['pasaranIndex']
        self.wuku_index = res['wukuIndex']
        self.mongso_index = mongso['index']

    # --- NATIVE-LIKE GETTERS (Numbers) ---
    def get_date(self):
        """Returns the day of the month (1-30)."""
        return self.date

    def get_day(self):
        """Returns the day of the week index (0=Minggu/Sunday)."""
        return self.day_index

    def get_month(self):
        """Returns the month index (0=Sura)."""
        return self.month_index

    def get_full_year(self):
        """Returns the Javanese year."""
        return self.year

    def get_hours(self): return self.native_date.hour
    def get_minutes(self): return self.native_date.minute
    def get_seconds(self): return self.native_date.second

    # --- JAVANESE SPECIFIC GETTERS ---
    def get_pasaran(self):
        """Returns the Pasaran index (0=Legi)."""
        return self.pasaran_index

    def get_neptu(self): return self.neptu
    
    def get_wuku(self):
        """Returns the Wuku index (0=Sinta)."""
        return self.wuku_index
        
    def get_mongso(self):
        """Returns the Mongso index (0=Kasa)."""
        return self.mongso_index
        
    def get_wektu(self): return self.wektu
    def get_gregorian_date(self): return self.native_date

    def to_datetime(self):
        return self.native_date

    def _calculate(self, date):
        # Normalize to noon to avoid DST issues and ensure consistent day difference
        input_date = datetime(date.year, date.month, date.day, 12, 0, 0)
        anchor_date = self.ANCHOR["masehi"]
        
        total_hari = (input_date - anchor_date).days
        
        # Pasaran: (1 + totalHari) % 5
        index_pasaran = (1 + total_hari) % 5
        
        # Hari (Dina): Python weekday 0=Mon, 6=Sun. DINA 0=Minggu, 1=Senen.
        index_hari = (input_date.weekday() + 1) % 7
        
        total_neptu = self.NEPTU_DINA[index_hari] + self.NEPTU_PASARAN[index_pasaran]
        
        # Wuku
        wuku_weeks = (total_hari + 6) // 7
        index_wuku = (17 + wuku_weeks) % 30
        
        # Javanese Year Calculation
        hari_jawa_running = self.ANCHOR["hariKe"] + total_hari
        taun_jawa = self.ANCHOR["taunJawa"]
        index_windu = 0
        
        while True:
            panjang_tahun = self.ANCHOR["polaWindu"][index_windu]
            if hari_jawa_running > panjang_tahun:
                hari_jawa_running -= panjang_tahun
                taun_jawa += 1
                index_windu = (index_windu + 1) % 8
            elif hari_jawa_running <= 0:
                index_windu = (index_windu - 1) % 8
                taun_jawa -= 1
                hari_jawa_running += self.ANCHOR["polaWindu"][index_windu]
            else:
                break
        
        is_kabisat = (self.ANCHOR["polaWindu"][index_windu] == 355)
        panjang_bulan = [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, (30 if is_kabisat else 29)]
        
        index_bulan = 0
        for i, length in enumerate(panjang_bulan):
            if hari_jawa_running <= length:
                index_bulan = i
                break
            hari_jawa_running -= length
            
        return {
            "tanggal": hari_jawa_running,
            "hariIndex": index_hari,
            "pasaranIndex": index_pasaran,
            "bulanIndex": index_bulan,
            "wukuIndex": index_wuku,
            "wulan": self.WULAN[index_bulan],
            "taun": taun_jawa,
            "namaTaun": self.TAUN[index_windu],
            "dina": self.DINA[index_hari],
            "pasaran": self.PASARAN[index_pasaran],
            "wuku": self.WUKU[index_wuku],
            "neptu": total_neptu
        }

    def _calculateMongso(self, date):
        day = date.day
        month = date.month
        current_val = (month * 100) + day
        
        if 622 <= current_val <= 801: return {"nama": "Kasa", "index": 0}
        elif 802 <= current_val <= 824: return {"nama": "Karo", "index": 1}
        elif 825 <= current_val <= 917: return {"nama": "Katelu", "index": 2}
        elif 918 <= current_val <= 1012: return {"nama": "Kapat", "index": 3}
        elif 1013 <= current_val <= 1108: return {"nama": "Kalima", "index": 4}
        elif 1109 <= current_val <= 1221: return {"nama": "Kanem", "index": 5}
        elif current_val >= 1222 or current_val <= 202: return {"nama": "Kapitu", "index": 6}
        elif 203 <= current_val <= 229: return {"nama": "Kawolu", "index": 7}
        elif 301 <= current_val <= 325: return {"nama": "Kasanga", "index": 8}
        elif 326 <= current_val <= 418: return {"nama": "Kasadasa", "index": 9}
        elif 419 <= current_val <= 511: return {"nama": "Desta", "index": 10}
        elif 512 <= current_val <= 621: return {"nama": "Sada", "index": 11}
        
        return {"nama": "Kapitu", "index": 6}

    def _calculateWektu(self, date):
        h = date.hour
        m = date.minute
        t = h + (m / 60)
        
        if 3.5 <= t < 4.5: return "Fajar"
        if 4.5 <= t < 5.5: return "Saput Lemah"
        if 5.5 <= t < 6.5: return "Byar"
        if 6.5 <= t < 9.0: return "Enjing"
        if 9.0 <= t < 11.0: return "Gumatel"
        if 11.0 <= t < 12.0: return "Tengange"
        if 12.0 <= t < 13.0: return "Bedhug"
        if 13.0 <= t < 15.0: return "Lingsir Kulon"
        if 15.0 <= t < 16.5: return "Ngasar"
        if 16.5 <= t < 17.5: return "Tunggang Gunung"
        if 17.5 <= t < 18.5: return "Surup"
        if 18.5 <= t < 19.5: return "Bakda Maghrib"
        if 19.5 <= t < 21.0: return "Isya"
        if 21.0 <= t < 23.0: return "Sirep Bocah"
        if t >= 23.0 or t < 1.0: return "Tengah Wengi"
        if 1.0 <= t < 3.5: return "Lingsir Wengi"
        return "Wengi"

    def is_kabisat(self):
        """
        Check if the current Javanese year is a leap year (Kabisat).
        Returns True if Kabisat (355 days), False if Wastu (354 days).
        """
        anchor_year = self.ANCHOR["taunJawa"]
        # Python modulo operator (%) works correctly for negative numbers (floored division),
        # unlike JS which requires extra handling.
        windu_index = (self.year - anchor_year) % 8
        return self.ANCHOR["polaWindu"][windu_index] == 355

    def format_string(self, pattern):
        """
        Format date using patterns.
        Tokens: D, P, d, dd, M, m, mm, yyyy, T, W, N, MS, WK, HH, MM, SS, Z
        """
        z = "+0000"
        if self.native_date.tzinfo:
            z = self.native_date.strftime("%z")

        data = {
            "yyyy": str(self.year), "MS": self.mongso,
            "mm": f"{self.month_index + 1:02d}", "dd": f"{self.date:02d}",
            "HH": f"{self.native_date.hour:02d}", "MM": f"{self.native_date.minute:02d}",
            "SS": f"{self.native_date.second:02d}", "Z": z,
            "WK": self.wektu, "T": self.taun, "W": self.wuku,
            "P": self.pasaran, "D": self.dina, "M": self.wulan,
            "N": str(self.neptu), "m": str(self.month_index + 1), "d": str(self.date)
        }

        return re.sub(r"\b(yyyy|MS|mm|dd|HH|MM|SS|WK|T|W|P|D|M|N|m|d|Z)\b", lambda m: data.get(m.group(1), m.group(1)), pattern)

    def weton_sabanjure(self, weton_name):
        """
        Find the next occurrence of a specific Weton relative to this date.
        """
        parts = weton_name.split()
        if len(parts) != 2:
            raise ValueError("Format Weton tidak valid. Seharusnya 'Dina Pasaran' (contoh 'Setu Pahing').")

        target_dina = parts[0].strip()
        target_pasaran = parts[1].strip()

        try:
            d_index = next(i for i, v in enumerate(self.DINA) if v.lower() == target_dina.lower())
            p_index = next(i for i, v in enumerate(self.PASARAN) if v.lower() == target_pasaran.lower())
        except StopIteration:
            raise ValueError(f"Komponen Weton tidak valid: {weton_name}")

        c_dina = self.day_index
        c_pasaran = self.pasaran_index

        # 1. Align Dina (7-day cycle)
        x = (d_index - c_dina) % 7
        if x <= 0:
            x += 7

        # 2. Align Pasaran (5-day cycle) while maintaining Dina alignment
        while (c_pasaran + x) % 5 != p_index:
            x += 7

        next_date = self.native_date + timedelta(days=x)
        return Tanggalan(next_date)

    def __str__(self):
        return f"{self.dina} {self.pasaran}, {self.date} {self.wulan} {self.year} Ja, {self.wektu}"

    @classmethod
    def from_string(cls, date_str, fmt):
        """
        Create a Tanggalan object from a Javanese date string using a format pattern.
        Supported tokens: d, dd, M, m, mm, yyyy, P, HH, MM, SS, Z.
        """
        tokens = {
            'yyyy': {'regex': r'(\d{4})', 'key': 'year', 'parser': int},
            'M': {'regex': r'([a-zA-Z\s]+)', 'key': 'monthName', 'parser': lambda v: v.strip()},
            'mm': {'regex': r'(\d{2})', 'key': 'monthIndex', 'parser': lambda v: int(v) - 1},
            'm': {'regex': r'(\d{1,2})', 'key': 'monthIndex', 'parser': lambda v: int(v) - 1},
            'dd': {'regex': r'(\d{2})', 'key': 'day', 'parser': int},
            'd': {'regex': r'(\d{1,2})', 'key': 'day', 'parser': int},
            'P': {'regex': r'([a-zA-Z]+)', 'key': 'pasaranName', 'parser': lambda v: v.strip()},
            'HH': {'regex': r'(\d{2})', 'key': 'hours', 'parser': int},
            'MM': {'regex': r'(\d{2})', 'key': 'minutes', 'parser': int},
            'SS': {'regex': r'(\d{2})', 'key': 'seconds', 'parser': int},
            'Z': {'regex': r'([+-]\d{4})', 'key': 'offset', 'parser': lambda v: (1 if v[0] == '+' else -1) * (int(v[1:3]) * 60 + int(v[3:5]))}
        }

        parts = re.split(r'\b(yyyy|MM|mm|M|m|dd|d|HH|SS|P|Z)\b', fmt)
        final_regex = "^"
        map_tokens = []
        
        for part in parts:
            if part in tokens:
                map_tokens.append(tokens[part])
                final_regex += tokens[part]['regex']
            else:
                final_regex += re.escape(part)
        final_regex += "$"
        
        match = re.match(final_regex, date_str)
        if not match:
            raise ValueError(f"Format tanggal \"{date_str}\" tidak sesuai dengan format \"{fmt}\"")
            
        data = {}
        for i, token in enumerate(map_tokens):
            val = match.group(i+1)
            data[token['key']] = token['parser'](val)
            
        if 'monthName' in data:
            try:
                m_idx = next(i for i, v in enumerate(cls.WULAN) if v.lower() == data['monthName'].lower())
                data['monthIndex'] = m_idx
            except StopIteration:
                raise ValueError(f"Nama bulan Jawa tidak valid: {data['monthName']}")
                
        if 'year' not in data or 'monthIndex' not in data or 'day' not in data:
            raise ValueError("Format harus mencakup tahun, bulan, dan tanggal.")
            
        total_days = 0
        start_year = cls.ANCHOR["taunJawa"]
        year = data['year']
        month_index = data['monthIndex']
        day = data['day']
        
        if year >= start_year:
            for y in range(start_year, year):
                windu_index = (y - start_year) % 8
                total_days += cls.ANCHOR["polaWindu"][windu_index]
        else:
            for y in range(year, start_year):
                idx = (y - start_year) % 8
                total_days -= cls.ANCHOR["polaWindu"][idx]
                
        standard_months = [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30]
        for i in range(month_index):
            total_days += standard_months[i]
            
        total_days += day
        days_from_anchor = total_days - cls.ANCHOR["hariKe"]
        
        anchor_date = cls.ANCHOR["masehi"]
        result_date = anchor_date + timedelta(days=days_from_anchor)
        
        h = data.get('hours', 0)
        m = data.get('minutes', 0)
        s = data.get('seconds', 0)
        
        result_date = result_date.replace(hour=h, minute=m, second=s)
        
        instance = cls(result_date)
        
        if 'pasaranName' in data:
            if instance.pasaran.lower() != data['pasaranName'].lower():
                raise ValueError(f"Tanggal tidak valid: {day} {data.get('monthName', cls.WULAN[month_index])} {year} jatuh pada {instance.pasaran}, bukan {data['pasaranName']}.")
                
        return instance