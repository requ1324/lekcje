# Zadanie: Aplikacja Flask - pogoda (5 pkt.)

### Cel zadania
Stwórz aplikację webową w technologii:
- Python
- Flask
- Bootstrap 5
- Integracja z API IMGW

Aplikacja ma umożliwiać sprawdzenie aktualnej pogody dla wybranego miasta.
---

## Wymagania

1. Strona powinna zawierać:
   - Formularz wyboru miasta (select)
   - Przycisk „Pobierz dane”
   - Estetyczny interfejs oparty o Bootstrap
---

2. Po wybraniu miasta aplikacja powinna wyświetlić:
   - IMGW:
      - Temperaturę
      - Wilgotność
      - Ciśnienie
      - Prędkość wiatru
      - Datę pomiaru
---

API:

Dane należy pobrać z:
https://danepubliczne.imgw.pl/api/data/synop
---

### Snippety pomocnicze

#### IMGW

```python
import requests

def get_imgw_data(station_name):
    url = "https://danepubliczne.imgw.pl/api/data/synop"
    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()
        for station in data:
            if station["stacja"].lower() == station_name.lower():
                return station
    return None
```

### Wymagane:
- użycie biblioteki requests 
- obsługa błędów API 
- wykorzystanie render_template 
- estetyczny layout Bootstrap

### Interfejs
Aplikacja musi zawierać:
- Navbar
- Bootstrap Cards
- Responsywny układ
- Kolorowe oznaczenie aktualnej pogody

## Kryteria oceny (max 5 pkt)

| Lp. | Element oceny                         | Punkty |
|-----|---------------------------------------|--------|
| 1   | Pobieranie danych z API IMGW          | 1      |
| 2   | Poprawna prezentacja danych           | 1      |
| 3   | Poprawna struktura projektu           | 1      |
| 4   | Obsługa błędów (API, brak danych)     | 1      |
| 5   | Estetyka i użycie Bootstrap           | 1      |
|     | **Razem**                             | **5**  |
