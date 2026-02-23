use chrono::{Local, NaiveDate};
use tanggalan::JavaneseDate;

#[test]
fn test_anchor_date_accuracy() {
    // Anchor: 1 Jan 2022
    // Expected: Setu Pahing, 28 Jumadilawal 1955 Ja, Tahun Alip, Wuku Marakeh
    let date = NaiveDate::from_ymd_opt(2022, 1, 1).unwrap().and_hms_opt(12, 0, 0).unwrap();
    let jd = JavaneseDate::new(date);

    assert_eq!(jd.dina, "Setu");
    assert_eq!(jd.pasaran, "Pahing");
    assert_eq!(jd.day_jawa, 28);
    assert_eq!(jd.wulan, "Jumadilawal");
    assert_eq!(jd.taun_jawa, 1955);
    assert_eq!(jd.taun, "Alip");
    assert_eq!(jd.wuku, "Marakeh");
}

#[test]
fn test_readme_example_date() {
    // Example: 17 Aug 2023
    // Expected: Kemis Kliwon
    let date = NaiveDate::from_ymd_opt(2023, 8, 17).unwrap().and_hms_opt(12, 0, 0).unwrap();
    let jd = JavaneseDate::new(date);

    assert_eq!(jd.dina, "Kemis");
    assert_eq!(jd.pasaran, "Kliwon");
    assert_eq!(jd.taun_jawa, 1957); // 1957 Jimawal
}

#[test]
fn test_weton_sabanjure_cycle() {
    // Start: 1 Jan 2022 (Setu Pahing)
    let date = NaiveDate::from_ymd_opt(2022, 1, 1).unwrap().and_hms_opt(12, 0, 0).unwrap();
    let jd = JavaneseDate::new(date);

    // Next Setu Pahing should be exactly 35 days later (Selapan)
    let next = jd.weton_sabanjure("Setu Pahing").expect("Should find next weton");
    
    let diff = (next.native_date - jd.native_date).num_days();
    assert_eq!(diff, 35);
}

#[test]
fn test_is_kabisat() {
    // 1955 Ja (Alip) is a leap year (355 days)
    let date = NaiveDate::from_ymd_opt(2022, 1, 1).unwrap().and_hms_opt(12, 0, 0).unwrap();
    let jd = JavaneseDate::new(date);
    assert!(jd.is_kabisat());
}

#[test]
fn test_format_string() {
    // Anchor: 1 Jan 2022 -> Setu Pahing, 28 Jumadilawal 1955 Ja
    let date = NaiveDate::from_ymd_opt(2022, 1, 1).unwrap().and_hms_opt(12, 0, 0).unwrap();
    let jd = JavaneseDate::new(date);

    let formatted = jd.format_string("D P, dd M yyyy");
    assert_eq!(formatted, "Setu Pahing, 28 Jumadilawal 1955");
    
    let formatted_complex = jd.format_string("WK, d-m-yyyy T");
    assert_eq!(formatted_complex, "Bedhug, 28-5-1955 Alip");
}

#[test]
fn test_from_string() {
    // Parse "28 Jumadilawal 1955"
    let jd = JavaneseDate::from_string("28 Jumadilawal 1955", "d M yyyy").expect("Parsing failed");
    
    assert_eq!(jd.day_jawa, 28);
    assert_eq!(jd.wulan, "Jumadilawal");
    assert_eq!(jd.taun_jawa, 1955);
    assert_eq!(jd.dina, "Setu"); // Derived correctly
    assert_eq!(jd.pasaran, "Pahing"); // Derived correctly

    // Valid Pasaran case
    let jd_valid = JavaneseDate::from_string("Pahing, 28 Jumadilawal 1955", "P, d M yyyy");
    assert!(jd_valid.is_ok());

    // Invalid Pasaran case (Actual is Pahing, input says Legi)
    let jd_err = JavaneseDate::from_string("Legi, 28 Jumadilawal 1955", "P, d M yyyy");
    assert!(jd_err.is_err());
}

#[test]
fn test_print_current_date() {
    let now = Local::now().naive_local();
    let jd = JavaneseDate::new(now);
    println!("1. Current Date: {}", jd);
}