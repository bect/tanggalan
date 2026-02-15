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

<a name="new_Tanggalan_new"></a>

### new Tanggalan([date])
Create a new Tanggalan instance.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [date] | <code>Date</code> | <code>new Date()</code> | The date to convert. Defaults to now. |

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
| pattern | <code>string</code> | The format pattern string. Tokens:  D(DayName), P(Pasaran), d(Date), dd(01), M(MonthName), m(MonthNo),  yyyy(Year), T(WinduYear), W(Wuku), N(Neptu), MS(Mongso), WK(Wektu), HH(Hours), MM(Minutes), SS(Seconds) |

