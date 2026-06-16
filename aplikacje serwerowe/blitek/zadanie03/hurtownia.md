# Hurtownia Jabłek - REST API Flask

**Czas:** 90 minut  
**Liczba punktów:** 20

---

## 📋 Polecenie

Twoim zadaniem jest **stworzenie REST API w Flask** do zarządzania danymi hurtowni jabłek.

Hurtownia sprzedaje jabłka od 3 stycznia 2022 do 31 grudnia 2022. Masz dostęp do:

- **jablka.txt** - 2500 transakcji sprzedaży
- **cennik.txt** - ceny poszczególnych odmian

Na podstawie tych danych stwórz API, które będzie obsługiwać 4 analizy.

---

## 📊 Struktura Danych

### Plik: `jablka.txt`

Format: TXT (tabulatory)

```
data        odmiana         typ  nip              kg
2022-01-03  Jonagold        Z    128-29-15-591    470
2022-01-03  Jonagold        Z    192-09-72-275    410
2022-01-03  Jonagored       Z    140-36-11-559    242
```

**Kolumny:**

- `data`: YYYY-MM-DD
- `odmiana`: nazwa (Jonagold, Alwa, Cortland, itp.)
- `typ`: Z=zimowa, J=jesienna, L=letnia
- `nip`: numer NIP klienta (13 znaków)
- `kg`: kilogramy sprzedane

### Plik: `cennik.txt`

Format: TXT (tabulatory)

```
odmiana       cena
Alwa          2,9
Antonowka     3,2
Cortland      3,2
```

---

## 🎯 Wymagane Endpointy API

### 1 ANALIZA 7.1: Top 3 Klienci - Jabłka Zimowe

**Endpoint:** `GET /api/analiza/top-klienci-zimowe`

**Wymagania:**

- ✅ Filtruj tylko transakcje gdzie `typ == 'Z'` (zimowa)
- ✅ Dla każdego klienta (NIP) sumuj kilogramy
- ✅ Zwróć top 3 klientów z największą ilością
- ✅ Zwróć NIP i kilogramy dla każdego

**Odpowiedź (200 OK):**

```json
{
  "status": "success",
  "analiza": "7.1",
  "nazwa": "Top 3 klienci - jabłka zimowe",
  "data": {
    "top_klienci": [
      {
        "nip": "128-29-15-591",
        "kilogramy": 5200
      },
      {
        "nip": "192-09-72-275",
        "kilogramy": 4800
      },
      {
        "nip": "140-36-11-559",
        "kilogramy": 4500
      }
    ]
  }
}
```

---

### 2 ANALIZA 7.2: Przychód i Najlepsza Odmiana

**Endpoint:** `GET /api/analiza/przychod`

**Wzór:**

```
Przychód = Σ (cena_za_kg × kilogramy) dla każdej transakcji
```

**Wymagania:**

- ✅ Policz przychód każdej transakcji
- ✅ Zsumuj całkowity przychód
- ✅ Dla każdej odmiany policz przychód
- ✅ Zwróć całkowity przychód i odmianę z największym przychodem
- ✅ Zaokrąglij przychody do 2 miejsc dziesiętnych

**Odpowiedź (200 OK):**

```json
{
  "status": "success",
  "analiza": "7.2",
  "nazwa": "Przychód i najlepsza odmiana",
  "data": {
    "calkowity_przychod": 125430.5,
    "najlepsza_odmiana": "Jonagold",
    "przychod_najlepszej": 45230.75,
    "top_odmiany": [
      {
        "odmiana": "Jonagold",
        "przychod": 45230.75
      },
      {
        "odmiana": "Alwa",
        "przychod": 38420.3
      },
      {
        "odmiana": "Cortland",
        "przychod": 25600.0
      }
    ]
  }
}
```

---

### 3 ANALIZA 7.3: Popularność Miesięczna

**Endpoint:** `GET /api/analiza/popularnosc-miesiecy`

**Wymagania:**

- ✅ Grupuj transakcje po miesiącach (YYYY-MM)
- ✅ Dla każdego miesiąca zlicz kg dla każdej odmiany
- ✅ Dla każdego miesiąca zwróć odmianę z największą sprzedażą
- ✅ Zwróć dane dla 12 miesięcy (styczeń-grudzień 2022)

**Odpowiedź (200 OK):**

```json
{
  "status": "success",
  "analiza": "7.3",
  "nazwa": "Najpopularniejsza odmiana w każdym miesiącu",
  "data": {
    "miesiace": [
      {
        "miesiac": "2022-01",
        "miesiac_nazwa": "Styczeń",
        "najpopularniejsza": "Jonagold",
        "kilogramy": 8500
      },
      {
        "miesiac": "2022-02",
        "miesiac_nazwa": "Luty",
        "najpopularniejsza": "Alwa",
        "kilogramy": 7200
      },
      {
        "miesiac": "2022-03",
        "miesiac_nazwa": "Marzec",
        "najpopularniejsza": "Cortland",
        "kilogramy": 6800
      }
    ]
  }
}
```

---

### 4 ANALIZA 7.4: System Rabatów

**Endpoint:** `GET /api/analiza/rabaty`

**Logika Rabatu:**

```
Rabat obliczany PRZED bieżącą transakcją!

Jeśli klient dotychczas zakupił:
- 15,000-20,000 kg → rabat 5 groszy za kg w BIEŻĄCEJ transakcji
- ≥ 20,000 kg → rabat 10 groszy za kg w BIEŻĄCEJ transakcji
```

**Wymagania:**

- ✅ Sortuj transakcje po dacie (chronologicznie)
- ✅ Śledź bieżący stan dla każdego klienta
- ✅ Dla każdej transakcji sprawdź, czy przysługuje rabat
- ✅ Rabat dotyczy ilości z BIEŻĄCEJ transakcji
- ✅ Policz liczbę transakcji z rabatem
- ✅ Policz całkowitą wartość rabatów

**Odpowiedź (200 OK):**

```json
{
  "status": "success",
  "analiza": "7.4",
  "nazwa": "System rabatów dla klientów hurtowych",
  "data": {
    "liczba_transakcji_z_rabatem": 245,
    "calkowita_wartosc_rabatow": 1850.75,
    "przedzial_5_groszy": {
      "liczba_transakcji": 120,
      "calkowita_wartosc": 450.3
    },
    "przedzial_10_groszy": {
      "liczba_transakcji": 125,
      "calkowita_wartosc": 1400.45
    }
  }
}
```

---

## ✅ Obsługa Błędów

**Wymagania:**

- ✅ Sprawdzaj, czy pliki istnieją
- ✅ Obsługuj błędy wczytywania pliku
- ✅ Zwracaj informacyjne komunikaty błędów
- ✅ Używaj właściwych kodów HTTP (200, 400, 500)

**Przykład błędu:**

```json
{
  "status": "error",
  "code": 500,
  "message": "Błąd wczytywania pliku jablka.txt: [szczegóły]"
}
```

---

## 💡 Podpowiedzi

### Wczytywanie TXT:

```python
transakcje = []
with open('jablka.txt', 'r', encoding='utf-8') as f:
    next(f)  # Pomiń nagłówek
    for linia in f:
        data, odmiana, typ, nip, kg = linia.strip().split('\t')
        transakcja = {
            'data': data,
            'odmiana': odmiana,
            'typ': typ,
            'nip': nip,
            'kg': int(kg)
        }
        transakcje.append(transakcja)
```

### Filtrowanie po typie:

```python
zimowe = [t for t in transakcje if t['typ'] == 'Z']
```

### Grupowanie:

```python
from collections import defaultdict

sums = defaultdict(int)
for t in zimowe:
    sums[t['nip']] += t['kg']

top_3 = sorted(sums.items(), key=lambda x: x[1], reverse=True)[:3]
```

### Parsowanie daty:

```python
miesiac = data[:7]  # "2022-01-15" → "2022-01"
```

---

### Pamiętaj:

- ✅ Zacznij od wczytywania danych
- ✅ Testuj każdy endpoint osobno
- ✅ Zwracaj JSON w każdej odpowiedzi
- ✅ Obsługuj błędy - API nie powinno się crashować
- ✅ Czytaj komunikaty błędów - są tam wskazówki!
- ✅ Zwróć uwagę na logikę rabatów (rabat PRZED transakcją!)
