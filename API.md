<a name="Tanggalan"></a>

## Tanggalan
Tanggalan JS Library
A comprehensive library for Javanese Calendar conversion.
Features: Weton, Wuku, Neptu, Mongso (Solar), and Traditional Time.
* Base Anchor: 1 Jan 2022

**Kind**: global class  

* [Tanggalan](#Tanggalan)
    * [new Tanggalan([date])](#new_Tanggalan_new)
    * [.toString()](#Tanggalan+toString) ⇒ <code>string</code>
    * [.formatString(pattern)](#Tanggalan+formatString) ⇒ <code>string</code>
    * [.isKabisat()](#Tanggalan+isKabisat) ⇒ <code>boolean</code>
    * [.getGregorianDate()](#Tanggalan+getGregorianDate) ⇒ <code>Date</code>
    * [.wetonSabanjure(wetonName)](#Tanggalan+wetonSabanjure) ⇒ <code>Tanggalan</code>

<a name="new_Tanggalan_new"></a>

### new Tanggalan([date])
Create a new Tanggalan instance.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [date] | <code>Date</code> | <code>new Date()</code> | The date to convert. Defaults to now. |

<a name="Tanggalan.fromString"></a>

### Tanggalan.fromString(str, format) ⇒ <code>Tanggalan</code>
Create a Tanggalan object from a Javanese date string using a format pattern.

**Kind**: static method of <code>Tanggalan</code>  
**Returns**: <code>Tanggalan</code> - The Tanggalan instance.  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | The Javanese date string. |
| format | <code>string</code> | The format pattern (e.g., "d M yyyy"). Supported tokens: d, dd, M, m, mm, yyyy, P, HH, MM, SS, Z. |

<a name="Tanggalan+isKabisat"></a>

### tanggalan.isKabisat() ⇒ <code>boolean</code>
Check if the current Javanese year is a leap year (Kabisat).

**Kind**: instance method of [<code>Tanggalan</code>](#Tanggalan)  
**Returns**: <code>boolean</code> - True if Kabisat (355 days), False if Wastu (354 days).

<a name="Tanggalan+getGregorianDate"></a>

### tanggalan.getGregorianDate() ⇒ <code>Date</code>
Get the native Gregorian Date object.

**Kind**: instance method of [<code>Tanggalan</code>](#Tanggalan)  
**Returns**: <code>Date</code> - A copy of the native Date object.

<a name="Tanggalan+wetonSabanjure"></a>

### tanggalan.wetonSabanjure(wetonName) ⇒ <code>Tanggalan</code>
Find the next occurrence of a specific Weton relative to this date.

**Kind**: instance method of [<code>Tanggalan</code>](#Tanggalan)  
**Returns**: <code>Tanggalan</code> - The Tanggalan instance of the next occurrence.  

| Param | Type | Description |
| --- | --- | --- |
| wetonName | <code>string</code> | The Weton name (e.g., "Setu Pahing"). |

<a name="Tanggalan+toString"></a>

### tanggalan.toString() ⇒ <code>string</code>
Returns standard string: "Setu Pahing, 26 Ruwah 1959 Ja, Surup"

**Kind**: instance method of [<code>Tanggalan</code>](#Tanggalan)  
**Returns**: <code>string</code> - The formatted string.  
<a name="Tanggalan+formatString"></a>

### tanggalan.formatString(pattern) ⇒ <code>string</code>
Format date using patterns.

**Kind**: instance method of [<code>Tanggalan</code>](#Tanggalan)  
**Returns**: <code>string</code> - The formatted string.  

| Param | Type | Description |
| --- | --- | --- |
| pattern | <code>string</code> | The format pattern string. Tokens:  D(DayName), P(Pasaran), d(Date), dd(01), M(MonthName), m(MonthNo),  yyyy(Year), T(WinduYear), W(Wuku), N(Neptu), MS(Mongso), WK(Wektu), HH(Hours), MM(Minutes), SS(Seconds), Z(Offset) |
