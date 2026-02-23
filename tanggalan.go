package tanggalan

import (
	"errors"
	"fmt"
	"math"
	"regexp"
	"strconv"
	"strings"
	"time"
)

// Constants for Javanese Calendar components
var (
	Pasaran = []string{"Legi", "Pahing", "Pon", "Wage", "Kliwon"}
	Dina    = []string{"Minggu", "Senen", "Selasa", "Rebo", "Kemis", "Jemuah", "Setu"}
	Wulan   = []string{
		"Sura", "Sapar", "Mulud", "Bakda Mulud", "Jumadilawal",
		"Jumadilakir", "Rejeb", "Ruwah", "Pasa", "Sawal", "Sela", "Besar",
	}
	Taun = []string{"Alip", "Ehe", "Jimawal", "Je", "Dal", "Be", "Wawu", "Jimakir"}
	Wuku = []string{
		"Sinta", "Landep", "Wukir", "Kurantil", "Tolu",
		"Gumbreg", "Warigalit", "Warigagung", "Julungwangi", "Sungsang",
		"Galungan", "Kuningan", "Langkir", "Mandasiya", "Julungpujut",
		"Pahang", "Kuruwelut", "Marakeh", "Tambir", "Medangkungan",
		"Maktal", "Wuye", "Manahil", "Prangbakat", "Bala",
		"Wugu", "Wayang", "Kulawu", "Dukut", "Watugunung",
	}
	Mongso = []string{
		"Kasa", "Karo", "Katelu", "Kapat", "Kalima", "Kanem",
		"Kapitu", "Kawolu", "Kasanga", "Kasadasa", "Desta", "Sada",
	}

	NeptuDina    = []int{5, 4, 3, 7, 8, 6, 9}
	NeptuPasaran = []int{5, 9, 7, 4, 8}
)

var formatRe = regexp.MustCompile(`\b(yyyy|MS|mm|dd|HH|MM|SS|WK|T|W|P|D|M|N|m|d|Z)\b`)

var parseTokens = map[string]struct {
	regex string
	key   string
}{
	"yyyy": {`(\d{4})`, "year"},
	"M":    {`([a-zA-Z\s]+)`, "monthName"},
	"mm":   {`(\d{2})`, "monthIndex"},
	"m":    {`(\d{1,2})`, "monthIndex"},
	"dd":   {`(\d{2})`, "day"},
	"d":    {`(\d{1,2})`, "day"},
	"P":    {`([a-zA-Z]+)`, "pasaran"},
	"D":    {`([a-zA-Z]+)`, "dina"},
	"HH":   {`(\d{2})`, "hour"},
	"MM":   {`(\d{2})`, "minute"},
	"SS":   {`(\d{2})`, "second"},
	"Z":    {`([+-]\d{4})`, "offset"},
}

// anchorData holds the reference point for calculations (1 Jan 2022)
type anchorData struct {
	Masehi    time.Time
	TaunJawa  int
	HariKe    int
	PolaWindu []int
}

// anchor is the base reference point: 1 Jan 2022
var anchor = anchorData{
	Masehi:    time.Date(2022, 1, 1, 12, 0, 0, 0, time.UTC), // Noon to avoid boundary issues
	TaunJawa:  1955,
	HariKe:    146,
	PolaWindu: []int{355, 354, 355, 354, 354, 354, 354, 355},
}

// Tanggalan represents a Javanese date.
type Tanggalan struct {
	nativeDate time.Time

	// Public properties (Strings)
	Dina    string // Day name (e.g., "Senen")
	Pasaran string // Pasaran name (e.g., "Wage")
	Wulan   string // Month name (e.g., "Sura")
	Taun    string // Year name (e.g., "Ehe")
	Wuku    string // Wuku name
	Mongso  string // Mongso name
	Wektu   string // Traditional time of day

	// Internal data (Numbers)
	date         int
	dayIndex     int
	pasaranIndex int
	monthIndex   int
	year         int
	neptu        int
	wukuIndex    int
	mongsoIndex  int
}

// New creates a new Tanggalan instance from a time.Time.
func New(t time.Time) *Tanggalan {
	// Keep native date
	nativeDate := t

	// Calculate components
	res := calculate(t)
	mongsoName, mongsoIndex := calculateMongso(t)
	wektu := calculateWektu(t)

	return &Tanggalan{
		nativeDate:   nativeDate,
		Dina:         res.dina,
		Pasaran:      res.pasaran,
		Wulan:        res.wulan,
		Taun:         res.namaTaun,
		Wuku:         res.wuku,
		Mongso:       mongsoName,
		Wektu:        wektu,
		date:         res.tanggal,
		dayIndex:     res.hariIndex,
		pasaranIndex: res.pasaranIndex,
		monthIndex:   res.bulanIndex,
		year:         res.taun,
		neptu:        res.neptu,
		wukuIndex:    res.wukuIndex,
		mongsoIndex:  mongsoIndex,
	}
}

// Date returns the Javanese date (1-30).
func (t *Tanggalan) Date() int {
	return t.date
}

// Day returns the day index (0=Minggu, 6=Setu).
func (t *Tanggalan) Day() int {
	return t.dayIndex
}

// Month returns the month index (0=Sura).
func (t *Tanggalan) Month() int {
	return t.monthIndex
}

// Year returns the Javanese year.
func (t *Tanggalan) Year() int {
	return t.year
}

// GetPasaran returns the pasaran index (0=Legi).
func (t *Tanggalan) GetPasaran() int {
	return t.pasaranIndex
}

// GetNeptu returns the total neptu value.
func (t *Tanggalan) GetNeptu() int {
	return t.neptu
}

// GetWuku returns the wuku index (0=Sinta).
func (t *Tanggalan) GetWuku() int {
	return t.wukuIndex
}

// GetMongso returns the mongso index (0=Kasa).
func (t *Tanggalan) GetMongso() int {
	return t.mongsoIndex
}

// GetWektu returns the traditional time of day.
func (t *Tanggalan) GetWektu() string {
	return t.Wektu
}

// GetGregorianDate returns the native time.Time.
func (t *Tanggalan) GetGregorianDate() time.Time {
	return t.nativeDate
}

// IsKabisat checks if the current Javanese year is a leap year (355 days).
func (t *Tanggalan) IsKabisat() bool {
	winduIndex := ((t.year-anchor.TaunJawa)%8 + 8) % 8
	return anchor.PolaWindu[winduIndex] == 355
}

// String returns the standard string representation.
func (t *Tanggalan) String() string {
	return fmt.Sprintf("%s %s, %d %s %d Ja, %s", t.Dina, t.Pasaran, t.date, t.Wulan, t.year, t.Wektu)
}

// Format returns a formatted string based on the layout pattern.
// Supported tokens:
// D (Dina), P (Pasaran), d (Date), dd (Date padded), M (Wulan), m (Month No), mm (Month No padded),
// yyyy (Year), T (Taun), W (Wuku), N (Neptu), MS (Mongso), WK (Wektu),
// HH (Hour), MM (Minute), SS (Second), Z (Zone Offset).
func (t *Tanggalan) Format(layout string) string {
	return formatRe.ReplaceAllStringFunc(layout, func(token string) string {
		switch token {
		case "yyyy":
			return fmt.Sprintf("%d", t.year)
		case "MS":
			return t.Mongso
		case "mm":
			return fmt.Sprintf("%02d", t.monthIndex+1)
		case "dd":
			return fmt.Sprintf("%02d", t.date)
		case "HH":
			return fmt.Sprintf("%02d", t.nativeDate.Hour())
		case "MM":
			return fmt.Sprintf("%02d", t.nativeDate.Minute())
		case "SS":
			return fmt.Sprintf("%02d", t.nativeDate.Second())
		case "WK":
			return t.Wektu
		case "T":
			return t.Taun
		case "W":
			return t.Wuku
		case "P":
			return t.Pasaran
		case "D":
			return t.Dina
		case "M":
			return t.Wulan
		case "N":
			return fmt.Sprintf("%d", t.neptu)
		case "m":
			return fmt.Sprintf("%d", t.monthIndex+1)
		case "d":
			return fmt.Sprintf("%d", t.date)
		case "Z":
			return t.nativeDate.Format("-0700")
		}
		return token
	})
}

// Parse creates a Tanggalan instance from a string using a layout pattern.
// Supported tokens: d, dd, M, m, mm, yyyy, P, HH, MM, SS, Z.
func Parse(value string, layout string) (*Tanggalan, error) {
	// 1. Build Regex and Map
	var keys []string
	tokenPattern := regexp.MustCompile(`\b(yyyy|MM|mm|M|m|dd|d|HH|SS|P|D|Z)\b`)

	idxs := tokenPattern.FindAllStringIndex(layout, -1)

	var sb strings.Builder
	sb.WriteString("^")
	lastPos := 0

	for _, idx := range idxs {
		start, end := idx[0], idx[1]
		// Escape text before token
		text := layout[lastPos:start]
		sb.WriteString(regexp.QuoteMeta(text))

		token := layout[start:end]
		info := parseTokens[token]
		sb.WriteString(info.regex)
		keys = append(keys, info.key)

		lastPos = end
	}
	// Escape remaining text
	sb.WriteString(regexp.QuoteMeta(layout[lastPos:]))
	sb.WriteString("$")

	re, err := regexp.Compile(sb.String())
	if err != nil {
		return nil, fmt.Errorf("invalid layout: %v", err)
	}

	matches := re.FindStringSubmatch(value)
	if matches == nil {
		return nil, fmt.Errorf("value '%s' does not match layout '%s'", value, layout)
	}

	// 2. Extract Data
	data := make(map[string]string)
	for i, key := range keys {
		if i+1 < len(matches) {
			data[key] = matches[i+1]
		}
	}

	// 3. Parse Values
	var year, monthIndex, day int
	var hour, minute, second int
	var offset int
	var hasOffset bool

	// Year
	if v, ok := data["year"]; ok {
		year, _ = strconv.Atoi(v)
	} else {
		return nil, errors.New("missing year")
	}

	// Month
	if v, ok := data["monthIndex"]; ok {
		m, _ := strconv.Atoi(v)
		monthIndex = m - 1
	} else if v, ok := data["monthName"]; ok {
		found := false
		vLower := strings.ToLower(strings.TrimSpace(v))
		for i, m := range Wulan {
			if strings.ToLower(m) == vLower {
				monthIndex = i
				found = true
				break
			}
		}
		if !found {
			return nil, fmt.Errorf("invalid month name: %s", v)
		}
	} else {
		return nil, errors.New("missing month")
	}

	// Day
	if v, ok := data["day"]; ok {
		day, _ = strconv.Atoi(v)
	} else {
		return nil, errors.New("missing day")
	}

	// Time
	if v, ok := data["hour"]; ok {
		hour, _ = strconv.Atoi(v)
	}
	if v, ok := data["minute"]; ok {
		minute, _ = strconv.Atoi(v)
	}
	if v, ok := data["second"]; ok {
		second, _ = strconv.Atoi(v)
	}

	// Offset
	if v, ok := data["offset"]; ok {
		if len(v) == 5 {
			sign := 1
			if v[0] == '-' {
				sign = -1
			}
			h, _ := strconv.Atoi(v[1:3])
			m, _ := strconv.Atoi(v[3:5])
			offset = sign * (h*60 + m)
			hasOffset = true
		}
	}

	// 4. Calculate Gregorian
	gDate := javaneseToGregorian(year, monthIndex, day)

	// Apply Time
	y, m, d := gDate.Date()
	var finalTime time.Time

	if hasOffset {
		loc := time.FixedZone("", offset*60)
		finalTime = time.Date(y, m, d, hour, minute, second, 0, loc)
	} else {
		finalTime = time.Date(y, m, d, hour, minute, second, 0, time.Local)
	}

	t := New(finalTime)

	// Validate Pasaran if provided
	if v, ok := data["pasaran"]; ok {
		if !strings.EqualFold(t.Pasaran, strings.TrimSpace(v)) {
			return nil, fmt.Errorf("invalid pasaran: expected %s, got %s", t.Pasaran, v)
		}
	}

	// Validate Dina if provided
	if v, ok := data["dina"]; ok {
		if !strings.EqualFold(t.Dina, strings.TrimSpace(v)) {
			return nil, fmt.Errorf("invalid dina: expected %s, got %s", t.Dina, v)
		}
	}

	return t, nil
}

// WetonSabanjure finds the next occurrence of a specific Weton relative to this date.
// wetonName should be in the format "Dina Pasaran" (e.g., "Setu Pahing").
func (t *Tanggalan) WetonSabanjure(wetonName string) (*Tanggalan, error) {
	parts := strings.Fields(wetonName)
	if len(parts) != 2 {
		return nil, fmt.Errorf("format weton tidak valid: %s (seharusnya 'Dina Pasaran')", wetonName)
	}

	targetDina := parts[0]
	targetPasaran := parts[1]

	dIndex := -1
	for i, d := range Dina {
		if strings.EqualFold(d, targetDina) {
			dIndex = i
			break
		}
	}

	pIndex := -1
	for i, p := range Pasaran {
		if strings.EqualFold(p, targetPasaran) {
			pIndex = i
			break
		}
	}

	if dIndex == -1 || pIndex == -1 {
		return nil, fmt.Errorf("komponen weton tidak valid: %s", wetonName)
	}

	cDina := t.dayIndex
	cPasaran := t.pasaranIndex

	// 1. Align Dina (7-day cycle)
	x := (dIndex - cDina) % 7
	if x <= 0 {
		x += 7
	}

	// 2. Align Pasaran (5-day cycle) while maintaining Dina alignment
	for (cPasaran+x)%5 != pIndex {
		x += 7
	}

	nextDate := t.nativeDate.AddDate(0, 0, x)
	return New(nextDate), nil
}

type calculationResult struct {
	tanggal      int
	hariIndex    int
	pasaranIndex int
	bulanIndex   int
	wukuIndex    int
	wulan        string
	taun         int
	namaTaun     string
	dina         string
	pasaran      string
	wuku         string
	neptu        int
}

func calculate(t time.Time) calculationResult {
	// Normalize to noon to avoid DST/boundary issues
	inputDate := time.Date(t.Year(), t.Month(), t.Day(), 12, 0, 0, 0, time.UTC)

	// Calculate days difference
	diff := inputDate.Sub(anchor.Masehi).Hours() / 24
	totalHari := int(math.Round(diff))

	// Pasaran
	indexPasaran := (1 + totalHari) % 5
	if indexPasaran < 0 {
		indexPasaran += 5
	}

	// Hari (Dina) - 0=Minggu
	indexHari := int(inputDate.Weekday())

	// Neptu
	totalNeptu := NeptuDina[indexHari] + NeptuPasaran[indexPasaran]

	// Wuku
	wukuWeeksFloat := float64(totalHari+6) / 7.0
	wukuWeeks := int(math.Floor(wukuWeeksFloat))

	indexWuku := (17 + wukuWeeks) % 30
	if indexWuku < 0 {
		indexWuku += 30
	}

	// Year/Month calculation
	hariJawaRunning := anchor.HariKe + totalHari
	taunJawa := anchor.TaunJawa
	indexWindu := 0

	for {
		panjangTahun := anchor.PolaWindu[indexWindu]
		if hariJawaRunning > panjangTahun {
			hariJawaRunning -= panjangTahun
			taunJawa++
			indexWindu = (indexWindu + 1) % 8
		} else if hariJawaRunning <= 0 {
			indexWindu = (indexWindu - 1 + 8) % 8
			taunJawa--
			hariJawaRunning += anchor.PolaWindu[indexWindu]
		} else {
			break
		}
	}

	isKabisat := anchor.PolaWindu[indexWindu] == 355
	panjangBulan := []int{30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29}
	if isKabisat {
		panjangBulan[11] = 30
	}

	indexBulan := 0
	for i := 0; i < 12; i++ {
		if hariJawaRunning <= panjangBulan[i] {
			indexBulan = i
			break
		}
		hariJawaRunning -= panjangBulan[i]
	}

	return calculationResult{
		tanggal:      hariJawaRunning,
		hariIndex:    indexHari,
		pasaranIndex: indexPasaran,
		bulanIndex:   indexBulan,
		wukuIndex:    indexWuku,
		wulan:        Wulan[indexBulan],
		taun:         taunJawa,
		namaTaun:     Taun[indexWindu],
		dina:         Dina[indexHari],
		pasaran:      Pasaran[indexPasaran],
		wuku:         Wuku[indexWuku],
		neptu:        totalNeptu,
	}
}

func javaneseToGregorian(year, monthIndex, day int) time.Time {
	totalDays := 0
	startYear := anchor.TaunJawa

	if year >= startYear {
		for y := startYear; y < year; y++ {
			winduIndex := (y - startYear) % 8
			totalDays += anchor.PolaWindu[winduIndex]
		}
	} else {
		for y := year; y < startYear; y++ {
			idx := (y - startYear) % 8
			if idx < 0 {
				idx += 8
			}
			totalDays -= anchor.PolaWindu[idx]
		}
	}

	winduIndexTarget := ((year-startYear)%8 + 8) % 8
	isKabisat := anchor.PolaWindu[winduIndexTarget] == 355

	panjangBulan := []int{30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29}
	if isKabisat {
		panjangBulan[11] = 30
	}

	for i := 0; i < monthIndex; i++ {
		totalDays += panjangBulan[i]
	}

	totalDays += day

	daysFromAnchor := totalDays - anchor.HariKe
	return anchor.Masehi.AddDate(0, 0, daysFromAnchor)
}

func calculateMongso(t time.Time) (string, int) {
	day := t.Day()
	month := int(t.Month())
	currentVal := (month * 100) + day

	if currentVal >= 622 && currentVal <= 801 {
		return "Kasa", 0
	}
	if currentVal >= 802 && currentVal <= 824 {
		return "Karo", 1
	}
	if currentVal >= 825 && currentVal <= 917 {
		return "Katelu", 2
	}
	if currentVal >= 918 && currentVal <= 1012 {
		return "Kapat", 3
	}
	if currentVal >= 1013 && currentVal <= 1108 {
		return "Kalima", 4
	}
	if currentVal >= 1109 && currentVal <= 1221 {
		return "Kanem", 5
	}
	if currentVal >= 1222 || currentVal <= 202 {
		return "Kapitu", 6
	}
	if currentVal >= 203 && currentVal <= 229 {
		return "Kawolu", 7
	}
	if currentVal >= 301 && currentVal <= 325 {
		return "Kasanga", 8
	}
	if currentVal >= 326 && currentVal <= 418 {
		return "Kasadasa", 9
	}
	if currentVal >= 419 && currentVal <= 511 {
		return "Desta", 10
	}
	if currentVal >= 512 && currentVal <= 621 {
		return "Sada", 11
	}

	return "Kapitu", 6
}

func calculateWektu(t time.Time) string {
	h := float64(t.Hour())
	m := float64(t.Minute())
	val := h + (m / 60.0)

	if val >= 3.5 && val < 4.5 {
		return "Fajar"
	}
	if val >= 4.5 && val < 5.5 {
		return "Saput Lemah"
	}
	if val >= 5.5 && val < 6.5 {
		return "Byar"
	}
	if val >= 6.5 && val < 9.0 {
		return "Enjing"
	}
	if val >= 9.0 && val < 11.0 {
		return "Gumatel"
	}
	if val >= 11.0 && val < 12.0 {
		return "Tengange"
	}
	if val >= 12.0 && val < 13.0 {
		return "Bedhug"
	}
	if val >= 13.0 && val < 15.0 {
		return "Lingsir Kulon"
	}
	if val >= 15.0 && val < 16.5 {
		return "Ngasar"
	}
	if val >= 16.5 && val < 17.5 {
		return "Tunggang Gunung"
	}
	if val >= 17.5 && val < 18.5 {
		return "Surup"
	}
	if val >= 18.5 && val < 19.5 {
		return "Bakda Maghrib"
	}
	if val >= 19.5 && val < 21.0 {
		return "Isya"
	}
	if val >= 21.0 && val < 23.0 {
		return "Sirep Bocah"
	}
	if val >= 23.0 || val < 1.0 {
		return "Tengah Wengi"
	}
	if val >= 1.0 && val < 3.5 {
		return "Lingsir Wengi"
	}

	return "Wengi"
}
