import sys
from datetime import datetime, date

try:
    from tanggalan import Tanggalan
except ImportError:
    print("Error: Could not import 'tanggalan'. Make sure you have run 'maturin develop'.")
    sys.exit(1)

def run_tests():
    print("🚀 Starting Tanggalan Python Tests...\n")

    # 1. Test Default Constructor (Current Time)
    now = Tanggalan()
    print(f"1. Current Date: {now}")
    
    # 2. Test with Python datetime (17 Aug 1945 - Independence Day)
    # 17 Aug 1945 is known to be Jemuah (Friday) Legi
    independence_day = datetime(1945, 8, 17, 10, 0, 0)
    jd_merdeka = Tanggalan(independence_day)
    print(f"2. Independence Day: {jd_merdeka}")
    
    assert jd_merdeka.dina == "Jemuah", f"Expected Jemuah, got {jd_merdeka.dina}"
    assert jd_merdeka.pasaran == "Legi", f"Expected Legi, got {jd_merdeka.pasaran}"
    print("   ✅ 17 Aug 1945 verified as Jemuah Legi")

    # 3. Test with Python date (no time)
    # 1 Jan 2024
    new_year = date(2024, 1, 1)
    jd_new_year = Tanggalan(new_year)
    print(f"3. New Year 2024: {jd_new_year}")

    # 4. Test Getters
    print(f"4. Properties of {jd_merdeka.dina} {jd_merdeka.pasaran}:")
    print(f"   - Wulan: {jd_merdeka.wulan}")
    print(f"   - Taun: {jd_merdeka.taun}")
    print(f"   - Wuku: {jd_merdeka.wuku}")
    print(f"   - Mongso: {jd_merdeka.mongso}")
    print(f"   - Neptu: {jd_merdeka.neptu}")
    print(f"   - Day Index: {jd_merdeka.day}")
    print(f"   - Native: {jd_merdeka.to_datetime()}")

    # 5. Test weton_sabanjure (Next occurrence of a Weton)
    # Find next Jemuah Legi after 1945
    next_weton = jd_merdeka.weton_sabanjure("Jemuah Legi")
    print(f"5. Next Jemuah Legi: {next_weton}")

    print("\n✨ All tests passed successfully!")

if __name__ == "__main__":
    run_tests()