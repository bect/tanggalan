from tanggalan import Tanggalan
from datetime import datetime

def test_constants_exist():
    assert len(Tanggalan.PASARAN) == 5
    assert len(Tanggalan.DINA) == 7
    assert Tanggalan.ANCHOR["taunJawa"] == 1955

def test_format_string():
    # 1 Jan 2022 -> Setu Pahing, 28 Jumadilawal 1955 Ja
    dt = datetime(2022, 1, 1, 12, 0, 0)
    t = Tanggalan(dt)
    
    assert t.format_string("D P") == "Setu Pahing"
    assert t.format_string("d M yyyy") == "28 Jumadilawal 1955"
    assert str(t) == "Setu Pahing, 28 Jumadilawal 1955 Ja, Bedhug"

def test_from_string():
    # 28 Jumadilawal 1955 -> Setu Pahing
    jd = Tanggalan.from_string("28 Jumadilawal 1955", "d M yyyy")
    assert jd.dina == "Setu"
    assert jd.pasaran == "Pahing"
    assert jd.year == 1955
    assert jd.month_index == 4 
    
    # With Pasaran validation
    jd2 = Tanggalan.from_string("Pahing, 28 Jumadilawal 1955", "P, d M yyyy")
    assert jd2.pasaran == "Pahing"
    assert jd2.year == 1955

def test_weton_sabanjure():
    # 1 Jan 2022 is Setu Pahing
    dt = datetime(2022, 1, 1, 12, 0, 0)
    t = Tanggalan(dt)
    
    # Next Setu Pahing should be 35 days later (Selapan)
    next_weton = t.weton_sabanjure("Setu Pahing")
    diff = (next_weton.native_date - t.native_date).days
    assert diff == 35
    assert next_weton.dina == "Setu"
    assert next_weton.pasaran == "Pahing"
    
    # Next Minggu Pon (Setu Pahing + 1 day)
    next_minggu_pon = t.weton_sabanjure("Minggu Pon")
    assert (next_minggu_pon.native_date - t.native_date).days == 1
    assert next_minggu_pon.dina == "Minggu"
    assert next_minggu_pon.pasaran == "Pon"

def test_js_api_similarity():
    # 1 Jan 2022 -> Setu Pahing, 28 Jumadilawal 1955
    dt = datetime(2022, 1, 1, 12, 0, 0)
    t = Tanggalan(dt)
    
    assert t.sasi == "Jumadilawal"
    assert t.get_date() == 28
    assert t.get_full_year() == 1955
    assert t.get_day() == 6 # Setu is index 6
    assert t.get_pasaran() == 1 # Pahing is index 1
    assert t.get_neptu() == 18 # Setu(9) + Pahing(9)
    assert t.to_datetime() == dt