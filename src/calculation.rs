use chrono::{Datelike, Duration, NaiveDate, NaiveDateTime, Timelike};
use crate::constants::*;
use crate::core::JavaneseDate;

pub struct CalculationResult {
    pub dina: &'static str,
    pub pasaran: &'static str,
    pub wulan: &'static str,
    pub taun: &'static str,
    pub wuku: &'static str,
    pub neptu: u8,
    pub taun_jawa: i32,
    pub day_jawa: u32,
    pub dina_index: usize,
    pub pasaran_index: usize,
    pub wulan_index: usize,
    pub wuku_index: usize,
}

pub fn calculate_mongso(date: &NaiveDateTime) -> (&'static str, usize) {
    let day = date.day();
    let month = date.month(); // 1-12
    let val = (month * 100) + day;

    if val >= 622 && val <= 801 { (MONGSO[0], 0) }
    else if val >= 802 && val <= 824 { (MONGSO[1], 1) }
    else if val >= 825 && val <= 917 { (MONGSO[2], 2) }
    else if val >= 918 && val <= 1012 { (MONGSO[3], 3) }
    else if val >= 1013 && val <= 1108 { (MONGSO[4], 4) }
    else if val >= 1109 && val <= 1221 { (MONGSO[5], 5) }
    else if val >= 1222 || val <= 202 { (MONGSO[6], 6) } // Dec 22 - Feb 2
    else if val >= 203 && val <= 229 { (MONGSO[7], 7) }
    else if val >= 301 && val <= 325 { (MONGSO[8], 8) }
    else if val >= 326 && val <= 418 { (MONGSO[9], 9) }
    else if val >= 419 && val <= 511 { (MONGSO[10], 10) }
    else { (MONGSO[11], 11) } // 512 - 621
}

pub fn calculate_wektu(date: &NaiveDateTime) -> &'static str {
    let h = date.hour() as f64;
    let m = date.minute() as f64;
    let t = h + (m / 60.0);

    if t >= 3.5 && t < 4.5 { "Fajar" }
    else if t >= 4.5 && t < 5.5 { "Saput Lemah" }
    else if t >= 5.5 && t < 6.5 { "Byar" }
    else if t >= 6.5 && t < 9.0 { "Enjing" }
    else if t >= 9.0 && t < 11.0 { "Gumatel" }
    else if t >= 11.0 && t < 12.0 { "Tengange" }
    else if t >= 12.0 && t < 13.0 { "Bedhug" }
    else if t >= 13.0 && t < 15.0 { "Lingsir Kulon" }
    else if t >= 15.0 && t < 16.5 { "Ngasar" }
    else if t >= 16.5 && t < 17.5 { "Tunggang Gunung" }
    else if t >= 17.5 && t < 18.5 { "Surup" }
    else if t >= 18.5 && t < 19.5 { "Bakda Maghrib" }
    else if t >= 19.5 && t < 21.0 { "Isya" }
    else if t >= 21.0 && t < 23.0 { "Sirep Bocah" }
    else if t >= 23.0 || t < 1.0 { "Tengah Wengi" }
    else if t >= 1.0 && t < 3.5 { "Lingsir Wengi" }
    else { "Wengi" }
}

pub fn calculate_calendar(date: &NaiveDateTime) -> CalculationResult {
    // Anchor: 1 Jan 2022, 12:00:00
    let anchor_date = NaiveDate::from_ymd_opt(ANCHOR.masehi_year, ANCHOR.masehi_month, ANCHOR.masehi_day)
        .unwrap()
        .and_hms_opt(12, 0, 0)
        .unwrap();
    
    // Normalize input to noon to match JS logic of rounding days
    let input_date = date.date().and_hms_opt(12, 0, 0).unwrap();
    
    let total_hari = (input_date - anchor_date).num_days();

    // Pasaran: (1 + totalHari) % 5
    let index_pasaran = (1 + total_hari).rem_euclid(5) as usize;

    // Hari (Dina)
    let index_hari = date.weekday().num_days_from_sunday() as usize; // 0 = Sunday

    // Neptu
    let total_neptu = NEPTU_DINA[index_hari] + NEPTU_PASARAN[index_pasaran];

    // Wuku
    let wuku_weeks = (total_hari + 6).div_euclid(7);
    let index_wuku = (17 + wuku_weeks).rem_euclid(30) as usize;

    // Year Calculation
    let mut hari_jawa_running = ANCHOR.hari_ke as i64 + total_hari;
    let mut taun_jawa = ANCHOR.taun_jawa;
    let mut index_windu = 0; // Alip is index 0 in ANCHOR

    loop {
        let panjang_tahun = ANCHOR.pola_windu[index_windu] as i64;
        if hari_jawa_running > panjang_tahun {
            hari_jawa_running -= panjang_tahun;
            taun_jawa += 1;
            index_windu = (index_windu + 1) % 8;
        } else if hari_jawa_running <= 0 {
            index_windu = (index_windu as isize - 1).rem_euclid(8) as usize;
            taun_jawa -= 1;
            hari_jawa_running += ANCHOR.pola_windu[index_windu] as i64;
        } else {
            break;
        }
    }

    let is_kabisat = ANCHOR.pola_windu[index_windu] == 355;
    let panjang_bulan = [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, if is_kabisat { 30 } else { 29 }];

    let mut index_bulan = 0;
    for (i, &len) in panjang_bulan.iter().enumerate() {
        if hari_jawa_running <= len as i64 {
            index_bulan = i;
            break;
        }
        hari_jawa_running -= len as i64;
    }

    CalculationResult {
        dina: DINA[index_hari],
        pasaran: PASARAN[index_pasaran],
        wulan: WULAN[index_bulan],
        taun: TAUN[index_windu],
        wuku: WUKU[index_wuku],
        neptu: total_neptu,
        taun_jawa,
        day_jawa: hari_jawa_running as u32,
        dina_index: index_hari,
        pasaran_index: index_pasaran,
        wulan_index: index_bulan,
        wuku_index: index_wuku,
    }
}

pub fn calculate_from_javanese(
    year: i32,
    month_index: usize,
    day: u32,
    hour: u32,
    minute: u32,
    second: u32
) -> Result<JavaneseDate, String> {
    let start_year = ANCHOR.taun_jawa;
    let mut total_days: i64 = 0;

    if year >= start_year {
        for y in start_year..year {
            let windu_index = (y - start_year).rem_euclid(8) as usize;
            total_days += ANCHOR.pola_windu[windu_index] as i64;
        }
    } else {
        for y in year..start_year {
            let windu_index = (y - start_year).rem_euclid(8) as usize;
            total_days -= ANCHOR.pola_windu[windu_index] as i64;
        }
    }

    let standard_months = [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30];
    for i in 0..month_index {
        if i < standard_months.len() {
            total_days += standard_months[i] as i64;
        }
    }

    total_days += day as i64;
    let days_from_anchor = total_days - ANCHOR.hari_ke as i64;

    let anchor_date = NaiveDate::from_ymd_opt(ANCHOR.masehi_year, ANCHOR.masehi_month, ANCHOR.masehi_day)
        .ok_or("Invalid anchor date")?
        .and_hms_opt(12, 0, 0)
        .ok_or("Invalid anchor time")?;

    let target_date_noon = anchor_date + Duration::days(days_from_anchor);
    let final_date = target_date_noon.date().and_hms_opt(hour, minute, second).ok_or("Invalid time components")?;
    
    Ok(JavaneseDate::new(final_date))
}