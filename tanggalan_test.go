package tanggalan

import (
	"testing"
	"time"
)

func TestCoreLogic(t *testing.T) {
	tests := []struct {
		date     time.Time
		dina     string
		pasaran  string
		wulan    string
		year     int
		dateJawa int
	}{
		{
			// 1 Jan 2022 -> Setu Pahing, 28 Jumadilawal 1955
			time.Date(2022, 1, 1, 0, 0, 0, 0, time.UTC),
			"Setu", "Pahing", "Jumadilawal", 1955, 28,
		},
		{
			// 17 Aug 2023 -> Kemis Kliwon, 30 Sura 1957
			time.Date(2023, 8, 17, 0, 0, 0, 0, time.UTC),
			"Kemis", "Kliwon", "Sura", 1957, 30,
		},
	}

	for _, tt := range tests {
		jawa := New(tt.date)
		if jawa.Dina != tt.dina {
			t.Errorf("Date %v: Expected Dina %s, got %s", tt.date, tt.dina, jawa.Dina)
		}
		if jawa.Pasaran != tt.pasaran {
			t.Errorf("Date %v: Expected Pasaran %s, got %s", tt.date, tt.pasaran, jawa.Pasaran)
		}
		if jawa.Wulan != tt.wulan {
			t.Errorf("Date %v: Expected Wulan %s, got %s", tt.date, tt.wulan, jawa.Wulan)
		}
		if jawa.year != tt.year {
			t.Errorf("Date %v: Expected Year %d, got %d", tt.date, tt.year, jawa.year)
		}
		if jawa.date != tt.dateJawa {
			t.Errorf("Date %v: Expected Date %d, got %d", tt.date, tt.dateJawa, jawa.date)
		}
	}
}

func TestFormat(t *testing.T) {
	date := time.Date(2022, 1, 1, 12, 0, 0, 0, time.UTC)
	jawa := New(date)

	// Test standard string
	if jawa.String() != "Setu Pahing, 28 Jumadilawal 1955 Ja, Bedhug" {
		// Note: 12:00 is Bedhug
		t.Errorf("String() mismatch: got %s", jawa.String())
	}

	// Test custom format
	layout := "D P, dd M yyyy"
	expected := "Setu Pahing, 28 Jumadilawal 1955"
	if got := jawa.Format(layout); got != expected {
		t.Errorf("Format() mismatch: expected %s, got %s", expected, got)
	}
}

func TestParse(t *testing.T) {
	// Case 1: Standard parsing
	str := "28 Jumadilawal 1955" // This is 1 Jan 2022
	layout := "d M yyyy"

	parsed, err := Parse(str, layout)
	if err != nil {
		t.Fatalf("Parse failed: %v", err)
	}

	if parsed.date != 28 {
		t.Errorf("Expected date 28, got %d", parsed.date)
	}
	if parsed.Wulan != "Jumadilawal" {
		t.Errorf("Expected Wulan Jumadilawal, got %s", parsed.Wulan)
	}
	if parsed.year != 1955 {
		t.Errorf("Expected Year 1955, got %d", parsed.year)
	}

	// Verify Gregorian date (should be 1 Jan 2022)
	y, m, d := parsed.GetGregorianDate().Date()
	if y != 2022 || m != 1 || d != 1 {
		t.Errorf("Expected Gregorian 2022-01-01, got %d-%02d-%02d", y, m, d)
	}

	// Case 2: With Pasaran validation
	str2 := "Setu Pahing, 28 Jumadilawal 1955"
	layout2 := "D P, dd M yyyy"
	parsed2, err := Parse(str2, layout2)
	if err != nil {
		t.Fatalf("Parse with pasaran failed: %v", err)
	}
	if parsed2.Pasaran != "Pahing" {
		t.Errorf("Expected Pasaran Pahing, got %s", parsed2.Pasaran)
	}

	// Case 3: Invalid Pasaran
	str3 := "Setu Legi, 28 Jumadilawal 1955" // Should be Pahing
	_, err = Parse(str3, layout2)
	if err == nil {
		t.Error("Expected error for invalid pasaran, got nil")
	}
}

func TestWetonSabanjure(t *testing.T) {
	start := time.Date(2022, 1, 1, 0, 0, 0, 0, time.UTC) // Setu Pahing
	jawa := New(start)

	// Next Setu Pahing should be 35 days later (Selapan)
	next, err := jawa.WetonSabanjure("Setu Pahing")
	if err != nil {
		t.Fatalf("WetonSabanjure failed: %v", err)
	}

	diff := next.GetGregorianDate().Sub(start).Hours() / 24
	if diff != 35 {
		t.Errorf("Expected next Setu Pahing in 35 days, got %.0f", diff)
	}
}

func TestIsKabisat(t *testing.T) {
	// 1955 is Kabisat (355 days)
	d1 := New(time.Date(2022, 1, 1, 0, 0, 0, 0, time.UTC))
	if !d1.IsKabisat() {
		t.Error("Expected 1955 to be Kabisat")
	}

	// 1956 (Ehe) -> Index 1 -> 354 days (Wastu)
	// 1 Jan 2023 is in 1956 Ja
	d2 := New(time.Date(2023, 1, 1, 0, 0, 0, 0, time.UTC))
	if d2.year == 1956 {
		if d2.IsKabisat() {
			t.Error("Expected 1956 to be Wastu (not Kabisat)")
		}
	}
}
