use chrono::{ Duration, NaiveDateTime, Timelike};
use std::fmt;
use regex::{Regex, Captures};
use crate::constants::*;
use crate::calculation::{calculate_calendar, calculate_from_javanese, calculate_mongso, calculate_wektu};

#[derive(Debug, Clone)]
pub struct JavaneseDate {
    pub native_date: NaiveDateTime,
    pub dina: &'static str,
    pub pasaran: &'static str,
    pub wulan: &'static str,
    pub taun: &'static str,
    pub wuku: &'static str,
    pub mongso: &'static str,
    pub wektu: &'static str,
    pub neptu: u8,
    pub taun_jawa: i32,
    pub day_jawa: u32,
    
    // Indices
    pub dina_index: usize,
    pub pasaran_index: usize,
    pub wulan_index: usize,
    pub wuku_index: usize,
    pub mongso_index: usize,
}

impl JavaneseDate {
    pub fn new(date: NaiveDateTime) -> Self {
        let (mongso, mongso_index) = calculate_mongso(&date);
        let wektu = calculate_wektu(&date);
        let calculation = calculate_calendar(&date);

        JavaneseDate {
            native_date: date,
            dina: calculation.dina,
            pasaran: calculation.pasaran,
            wulan: calculation.wulan,
            taun: calculation.taun,
            wuku: calculation.wuku,
            mongso,
            wektu,
            neptu: calculation.neptu,
            taun_jawa: calculation.taun_jawa,
            day_jawa: calculation.day_jawa,
            dina_index: calculation.dina_index,
            pasaran_index: calculation.pasaran_index,
            wulan_index: calculation.wulan_index,
            wuku_index: calculation.wuku_index,
            mongso_index,
        }
    }

    /// Check if the current Javanese year is a leap year (Kabisat).
    pub fn is_kabisat(&self) -> bool {
        let anchor_year = ANCHOR.taun_jawa;
        let windu_index = (self.taun_jawa - anchor_year).rem_euclid(8) as usize;
        ANCHOR.pola_windu[windu_index] == 355
    }

    /// Find the next occurrence of a specific Weton relative to this date.
    pub fn weton_sabanjure(&self, weton_name: &str) -> Result<JavaneseDate, String> {
        let parts: Vec<&str> = weton_name.split_whitespace().collect();
        if parts.len() != 2 {
            return Err("Format Weton tidak valid. Seharusnya 'Dina Pasaran'.".to_string());
        }
        let target_dina = parts[0];
        let target_pasaran = parts[1];

        let d_index = DINA.iter().position(|&d| d.eq_ignore_ascii_case(target_dina))
            .ok_or_else(|| format!("Invalid Dina: {}", target_dina))?;
        
        let p_index = PASARAN.iter().position(|&p| p.eq_ignore_ascii_case(target_pasaran))
            .ok_or_else(|| format!("Invalid Pasaran: {}", target_pasaran))?;

        let current_dina = self.dina_index as isize;
        let current_pasaran = self.pasaran_index as isize;

        // 1. Align Dina (7-day cycle)
        let mut x = (d_index as isize - current_dina).rem_euclid(7);
        if x <= 0 { x += 7; } // Ensure strictly future

        // 2. Align Pasaran (5-day cycle) while maintaining Dina alignment
        while (current_pasaran + x).rem_euclid(5) != p_index as isize {
            x += 7;
        }

        let next_date = self.native_date + Duration::days(x as i64);
        Ok(JavaneseDate::new(next_date))
    }

    /// Format the date using a pattern string.
    /// Supported tokens: yyyy, MS, mm, dd, HH, MM, SS, WK, T, W, P, D, M, N, m, d.
    pub fn format_string(&self, pattern: &str) -> String {
        let re = Regex::new(r"\b(yyyy|MS|mm|dd|HH|MM|SS|WK|T|W|P|D|M|N|m|d)\b").unwrap();
        
        re.replace_all(pattern, |caps: &Captures| {
            match &caps[0] {
                "yyyy" => self.taun_jawa.to_string(),
                "MS" => self.mongso.to_string(),
                "mm" => format!("{:02}", self.wulan_index + 1),
                "dd" => format!("{:02}", self.day_jawa),
                "HH" => format!("{:02}", self.native_date.hour()),
                "MM" => format!("{:02}", self.native_date.minute()),
                "SS" => format!("{:02}", self.native_date.second()),
                "WK" => self.wektu.to_string(),
                "T" => self.taun.to_string(),
                "W" => self.wuku.to_string(),
                "P" => self.pasaran.to_string(),
                "D" => self.dina.to_string(),
                "M" => self.wulan.to_string(),
                "N" => self.neptu.to_string(),
                "m" => (self.wulan_index + 1).to_string(),
                "d" => self.day_jawa.to_string(),
                _ => caps[0].to_string(),
            }
        }).to_string()
    }

    /// Create a JavaneseDate from a string using a format pattern.
    pub fn from_string(input: &str, format: &str) -> Result<JavaneseDate, String> {
        let tokens = [
            ("yyyy", r"(\d{4})"),
            ("M", r"([a-zA-Z\s]+)"),
            ("mm", r"(\d{2})"),
            ("m", r"(\d{1,2})"),
            ("dd", r"(\d{2})"),
            ("d", r"(\d{1,2})"),
            ("HH", r"(\d{2})"),
            ("MM", r"(\d{2})"),
            ("SS", r"(\d{2})"),
            ("P", r"([a-zA-Z]+)"),
        ];

        let mut regex_str = regex::escape(format);
        let mut keys = Vec::new();

        // Replace tokens in format with regex capture groups
        let token_re = Regex::new(r"\b(yyyy|mm|dd|HH|MM|SS|M|m|d|P)\b").unwrap();
        
        regex_str = token_re.replace_all(&regex_str, |caps: &Captures| {
            let token = &caps[0];
            keys.push(token.to_string());
            tokens.iter().find(|t| t.0 == token).unwrap().1.to_string()
        }).to_string();

        let re = Regex::new(&format!("^{}$", regex_str)).map_err(|e| e.to_string())?;
        let caps = re.captures(input).ok_or_else(|| format!("Date string '{}' does not match format '{}'", input, format))?;

        let mut year = ANCHOR.taun_jawa;
        let mut month_index = 0;
        let mut day = 1;
        let mut hour = 0;
        let mut minute = 0;
        let mut second = 0;
        let mut pasaran_name = None;

        for (i, key) in keys.iter().enumerate() {
            let val = caps.get(i + 1).unwrap().as_str();
            match key.as_str() {
                "yyyy" => year = val.parse().map_err(|_| "Invalid year")?,
                "mm" | "m" => month_index = val.parse::<usize>().map_err(|_| "Invalid month")? - 1,
                "dd" | "d" => day = val.parse().map_err(|_| "Invalid day")?,
                "HH" => hour = val.parse().map_err(|_| "Invalid hour")?,
                "MM" => minute = val.parse().map_err(|_| "Invalid minute")?,
                "SS" => second = val.parse().map_err(|_| "Invalid second")?,
                "M" => {
                    month_index = WULAN.iter()
                        .position(|&m| m.eq_ignore_ascii_case(val.trim()))
                        .ok_or_else(|| format!("Invalid month name: {}", val))?;
                },
                "P" => pasaran_name = Some(val),
                _ => {}
            }
        }

        let jd = calculate_from_javanese(year, month_index, day, hour, minute, second)?;

        if let Some(p_name) = pasaran_name {
            if !jd.pasaran.eq_ignore_ascii_case(p_name) {
                return Err(format!("Invalid Pasaran: {} falls on {}, not {}", input, jd.pasaran, p_name));
            }
        }

        Ok(jd)
    }
}
impl fmt::Display for JavaneseDate {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{} {}, {} {} {} Ja, {}", 
            self.dina, 
            self.pasaran, 
            self.day_jawa, 
            self.wulan, 
            self.taun_jawa, 
            self.wektu
        )
    }
}