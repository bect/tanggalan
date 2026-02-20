use pyo3::prelude::*;
use chrono::{NaiveDateTime};
use crate::core::JavaneseDate;

#[pyclass]
pub struct Tanggalan {
    inner: JavaneseDate,
}

#[pymethods]
impl Tanggalan {
    #[new]
    #[pyo3(signature = (date=None))]
    fn new(date: Option<Bound<'_, PyAny>>) -> PyResult<Self> {
        let naive = if let Some(d) = date {
            if let Ok(dt) = d.extract::<NaiveDateTime>() {
                dt
            } else if let Ok(d) = d.extract::<chrono::NaiveDate>() {
                d.and_hms_opt(12, 0, 0).unwrap()
            } else if let Ok(ts) = d.extract::<f64>() {
                let seconds = ts as i64;
                let nanos = ((ts.fract()) * 1_000_000_000.0) as u32;
                chrono::DateTime::from_timestamp(seconds, nanos)
                    .map(|dt| dt.naive_utc())
                    .unwrap_or_default()
            } else {
                return Err(pyo3::exceptions::PyTypeError::new_err("Argument must be datetime, date, or timestamp"));
            }
        } else {
            chrono::Local::now().naive_local()
        };

        Ok(Tanggalan {
            inner: JavaneseDate::new(naive)
        })
    }

    #[getter]
    fn dina(&self) -> String { self.inner.dina.to_string() }

    #[getter]
    fn pasaran(&self) -> String { self.inner.pasaran.to_string() }

    #[getter]
    fn wulan(&self) -> String { self.inner.wulan.to_string() }

    #[getter]
    fn taun(&self) -> String { self.inner.taun.to_string() }

    #[getter]
    fn wuku(&self) -> String { self.inner.wuku.to_string() }

    #[getter]
    fn mongso(&self) -> String { self.inner.mongso.to_string() }

    #[getter]
    fn wektu(&self) -> String { self.inner.wektu.to_string() }

    #[getter]
    fn neptu(&self) -> u8 { self.inner.neptu }

    #[getter]
    fn date(&self) -> u32 { self.inner.day_jawa }

    #[getter]
    fn year(&self) -> i32 { self.inner.taun_jawa }

    #[getter]
    fn day(&self) -> usize { self.inner.dina_index }

    #[getter]
    fn month(&self) -> usize { self.inner.wulan_index }

    #[getter]
    fn pasaran_index(&self) -> usize { self.inner.pasaran_index }

    #[getter]
    fn wuku_index(&self) -> usize { self.inner.wuku_index }

    #[getter]
    fn mongso_index(&self) -> usize { self.inner.mongso_index }

    fn to_datetime(&self) -> NaiveDateTime {
        self.inner.native_date
    }

    fn is_kabisat(&self) -> bool {
        self.inner.is_kabisat()
    }

    fn weton_sabanjure(&self, weton_name: &str) -> PyResult<Self> {
        match self.inner.weton_sabanjure(weton_name) {
            Ok(jd) => Ok(Tanggalan { inner: jd }),
            Err(e) => Err(pyo3::exceptions::PyValueError::new_err(e)),
        }
    }

    fn format_string(&self, pattern: &str) -> String {
        self.inner.format_string(pattern)
    }

    #[staticmethod]
    fn from_string(input: &str, format: &str) -> PyResult<Self> {
        match JavaneseDate::from_string(input, format) {
            Ok(jd) => Ok(Tanggalan { inner: jd }),
            Err(e) => Err(pyo3::exceptions::PyValueError::new_err(e)),
        }
    }

    fn __str__(&self) -> String {
        format!("{} {}, {} {} {} Ja, {}", 
            self.inner.dina, 
            self.inner.pasaran, 
            self.inner.day_jawa, 
            self.inner.wulan, 
            self.inner.taun_jawa, 
            self.inner.wektu
        )
    }

    fn __repr__(&self) -> String {
        format!("<Tanggalan: {}>", self.__str__())
    }
}

#[pymodule]
fn tanggalan(m: &Bound<'_, PyModule>) -> PyResult<()> {
    m.add_class::<Tanggalan>()?;
    Ok(())
}
