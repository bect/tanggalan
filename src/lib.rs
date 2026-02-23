//! # Tanggalan
//!
//! Pustaka Rust untuk konversi dan perhitungan Kalender Jawa.
//!
//! ## Penggunaan
//!
//! ```rust
//! use tanggalan::JavaneseDate;
//! use chrono::NaiveDate;
//!
//! let date = NaiveDate::from_ymd_opt(2022, 1, 1).unwrap().and_hms_opt(12, 0, 0).unwrap();
//! let jd = JavaneseDate::new(date);
//! println!("{}", jd);
//! ```

pub mod constants;
pub mod core;
pub mod calculation;

/// Re-export struct utama untuk kemudahan penggunaan.
pub use core::JavaneseDate;
