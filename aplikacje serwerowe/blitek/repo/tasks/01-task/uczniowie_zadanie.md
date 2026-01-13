# Zadanie: Aplikacja Flask – zarządzanie uczniami

### Cel zadania
Stwórz aplikację w Pythonie (Flask + Flask-Bootstrap + Flask-WTF), która umożliwia zarządzanie listą uczniów z wykorzystaniem **formularzy jako klas** oraz **pliku JSON** do przechowywania danych.

---

## Wymagania

1. Aplikacja powinna umożliwiać:
   - wyświetlanie listy uczniów w tabeli (Bootstrap),
   - dodawanie nowych uczniów przez formularz (klasa formularza w `app.py`),
   - usuwanie wybranego ucznia,
   - przechowywanie danych w pliku `students.json`.

2. Formularz powinien zawierać pola:
   - **Imię** (pole wymagane),
   - **Nazwisko** (pole wymagane),
   - **Klasa** (pole wymagane).

3. Szablony HTML powinny korzystać z:
   - `bootstrap/base.html` (rozszerzanie),
   - komponentów Bootstrapa (formularze, tabela, przyciski).

4. Plik `students.json` powinien przechowywać dane w formacie:
   ```json
   [
     {"id": 1, "first_name": "Anna", "last_name": "Kowalska", "class_name": "3A"},
     {"id": 2, "first_name": "Jan", "last_name": "Nowak", "class_name": "2B"}
   ]
## Struktura projektu
```code
projekt_uczniowie/
├── app.py
├── students.json
└── templates/
    ├── index.html
    └── add_student.html
```
## Kryteria oceny (max 10 pkt)
1. Poprawna konfiguracja aplikacji Flask i Flask-Bootstrap (2 pkt)
2. Formularz zdefiniowany jako klasa w app.py (2 pkt)
3. Obsługa walidacji danych (2 pkt)
4. Zapisywanie i odczyt danych z pliku JSON (2 pkt)
5. Estetyczne wyświetlanie tabeli i formularza w Bootstrapie (2 pkt)