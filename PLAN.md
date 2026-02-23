# Plan: Porting Tanggalan JS to Pure Python

Target: Rewrite `lib/tanggalan.js` into a Python package `tanggalan`.

## 1. Project Setup
- [x] Initialize `pyproject.toml` for a pure Python project.
- [x] Create directory structure:
    ```text
    ./__init__.py
    ./core.py
    tests/
    └── test_tanggalan.py
    ```

## 2. Constants & Configuration
- [x] Port static constants from JS `Tanggalan` class to Python:
    - `PASARAN`, `DINA`, `WULAN`, `TAUN`, `WUKU`, `MONGSO`
    - `NEPTU_DINA`, `NEPTU_PASARAN`
    - `ANCHOR` data (1 Jan 2022 base).

## 3. Core Logic (`Tanggalan` class)
- [x] **Constructor**:
    - Accept `datetime` or `date` object.
    - Handle timezone naive vs aware (normalize to naive for calculation).
- [x] **Calculation Engine (`_calculate`)**:
    - Replicate the loop-based logic for Windu/Year/Month traversal.
    - Use `datetime` subtraction for `total_days`.
- [x] **Mongso & Wektu**:
    - Port `_calculateMongso` (based on day/month index).
    - Port `_calculateWektu` (based on float hours).

## 4. Public API Methods
- [x] **Properties**: `dina`, `pasaran`, `wuku`, `neptu`, `wektu`, `sasi`, etc.
- [x] **`is_kabisat()`**: Check leap year based on Windu pattern.
- [x] **`format_string(pattern)`**:
    - Implement regex-based token replacement similar to JS version.
- [x] **`from_string(str, format)`**:
    - Implement regex parser to extract date components.
    - Reconstruct date from Javanese components relative to Anchor.
- [x] **`weton_sabanjure(weton_name)`**:
    - Implement the modulo arithmetic for finding next day/pasaran combination.

## 5. Testing
- [ ] Install `pytest`.
- [ ] Create tests verifying:
    - Anchor date (1 Jan 2022).
    - Known historical dates (e.g., 17 Aug 1945).
    - Edge cases (leap years/kabisat).
    - Parsing and Formatting consistency.