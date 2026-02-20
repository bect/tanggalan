use wasm_bindgen::prelude::*;
use crate::core::JavaneseDate;
use chrono::{NaiveDate, Timelike, Datelike};
use js_sys::{Date};

#[wasm_bindgen]
pub struct Tanggalan {
    inner: JavaneseDate,
}

#[wasm_bindgen]
impl Tanggalan {
    #[wasm_bindgen(constructor)]
    pub fn new(val: JsValue) -> Result<Tanggalan, JsValue> {
        let date = if val.is_undefined() || val.is_null() {
            Date::new_0()
        } else if val.is_instance_of::<Date>() {
            val.unchecked_into::<Date>()
        } else {
            Date::new(&val)
        };

        if date.get_time().is_nan() {
            return Err(JsValue::from_str("Invalid Date"));
        }

        let year = date.get_full_year() as i32;
        let month = date.get_month() as u32 + 1; // JS months are 0-11
        let day = date.get_date() as u32;
        let hour = date.get_hours() as u32;
        let minute = date.get_minutes() as u32;
        let second = date.get_seconds() as u32;
        let milli = date.get_milliseconds() as u32;

        let naive = NaiveDate::from_ymd_opt(year, month, day)
            .and_then(|d| d.and_hms_milli_opt(hour, minute, second, milli))
            .unwrap_or_default();

        Ok(Tanggalan {
            inner: JavaneseDate::new(naive)
        })
    }

    // Properties (Getters)
    #[wasm_bindgen(getter)]
    pub fn dina(&self) -> String { self.inner.dina.to_string() }
    
    #[wasm_bindgen(getter)]
    pub fn pasaran(&self) -> String { self.inner.pasaran.to_string() }
    
    #[wasm_bindgen(getter)]
    pub fn wulan(&self) -> String { self.inner.wulan.to_string() }
    
    #[wasm_bindgen(getter)]
    pub fn sasi(&self) -> String { self.inner.wulan.to_string() } // Alias
    
    #[wasm_bindgen(getter)]
    pub fn taun(&self) -> String { self.inner.taun.to_string() }
    
    #[wasm_bindgen(getter)]
    pub fn wuku(&self) -> String { self.inner.wuku.to_string() }
    
    #[wasm_bindgen(getter)]
    pub fn mongso(&self) -> String { self.inner.mongso.to_string() }
    
    #[wasm_bindgen(getter)]
    pub fn wektu(&self) -> String { self.inner.wektu.to_string() }

    // Native-like Getters
    #[wasm_bindgen(js_name = getDate)]
    pub fn get_date(&self) -> u32 { self.inner.day_jawa }
    
    #[wasm_bindgen(js_name = getDay)]
    pub fn get_day(&self) -> usize { self.inner.dina_index }
    
    #[wasm_bindgen(js_name = getMonth)]
    pub fn get_month(&self) -> usize { self.inner.wulan_index }
    
    #[wasm_bindgen(js_name = getFullYear)]
    pub fn get_full_year(&self) -> i32 { self.inner.taun_jawa }

    #[wasm_bindgen(js_name = getHours)]
    pub fn get_hours(&self) -> u32 { self.inner.native_date.hour() }
    
    #[wasm_bindgen(js_name = getMinutes)]
    pub fn get_minutes(&self) -> u32 { self.inner.native_date.minute() }
    
    #[wasm_bindgen(js_name = getSeconds)]
    pub fn get_seconds(&self) -> u32 { self.inner.native_date.second() }

    // Javanese Specific Getters
    #[wasm_bindgen(js_name = getPasaran)]
    pub fn get_pasaran(&self) -> usize { self.inner.pasaran_index }
    
    #[wasm_bindgen(js_name = getNeptu)]
    pub fn get_neptu(&self) -> u8 { self.inner.neptu }
    
    #[wasm_bindgen(js_name = getWuku)]
    pub fn get_wuku(&self) -> usize { self.inner.wuku_index }
    
    #[wasm_bindgen(js_name = getMongso)]
    pub fn get_mongso(&self) -> usize { self.inner.mongso_index }
    
    #[wasm_bindgen(js_name = getWektu)]
    pub fn get_wektu(&self) -> String { self.inner.wektu.to_string() }

    #[wasm_bindgen(js_name = isKabisat)]
    pub fn is_kabisat(&self) -> bool { self.inner.is_kabisat() }

    #[wasm_bindgen(js_name = getGregorianDate)]
    pub fn get_gregorian_date(&self) -> Date {
        let dt = self.inner.native_date;
        Date::new_with_year_month_day_hr_min_sec_milli(
            dt.year() as u32,
            dt.month0() as i32,
            dt.day() as i32,
            dt.hour() as i32,
            dt.minute() as i32,
            dt.second() as i32,
            (dt.nanosecond() / 1_000_000) as i32,
        )
    }

    #[wasm_bindgen(js_name = toString)]
    pub fn to_string(&self) -> String {
        format!("{} {}, {} {} {} Ja, {}", 
            self.inner.dina, 
            self.inner.pasaran, 
            self.inner.day_jawa, 
            self.inner.wulan, 
            self.inner.taun_jawa, 
            self.inner.wektu
        )
    }

    #[wasm_bindgen(js_name = formatString)]
    pub fn format_string(&self, pattern: &str) -> String {
        let formatted = self.inner.format_string(pattern);

        // Handle Z (Timezone) which is specific to JS environment
        let offset_min = -Date::new_0().get_timezone_offset();
        let sign = if offset_min >= 0.0 { "+" } else { "-" };
        let abs_offset = offset_min.abs() as i32;
        let z = format!("{}{:02}{:02}", sign, abs_offset / 60, abs_offset % 60);

        // Replace Z manually as core doesn't handle browser timezone
        formatted.replace("Z", &z)
    }

    #[wasm_bindgen(js_name = wetonSabanjure)]
    pub fn weton_sabanjure(&self, weton_name: &str) -> Result<Tanggalan, JsValue> {
        match self.inner.weton_sabanjure(weton_name) {
            Ok(jd) => Ok(Tanggalan { inner: jd }),
            Err(e) => Err(JsValue::from_str(&e)),
        }
    }

    #[wasm_bindgen(js_name = fromString)]
    pub fn from_string(input: &str, format: &str) -> Result<Tanggalan, JsValue> {
        match JavaneseDate::from_string(input, format) {
            Ok(jd) => Ok(Tanggalan { inner: jd }),
            Err(e) => Err(JsValue::from_str(&e)),
        }
    }
}