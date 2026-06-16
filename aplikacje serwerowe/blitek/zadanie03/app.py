import csv
from pathlib import Path

from flask import Flask, jsonify


app = Flask(__name__)

BASE_DIR = Path(__file__).resolve().parent
JABLKA_FILE = BASE_DIR / "jablka.txt"
CENNIK_FILE = BASE_DIR / "cennik.txt"


def load_jablka():
    with JABLKA_FILE.open(encoding="utf-8", newline="") as file:
        reader = csv.DictReader(file, delimiter="\t")
        return [
            {
                "data": row["data"],
                "odmiana": row["odmiana"],
                "typ": row["typ"],
                "nip": row["nip"],
                "kg": int(row["kg"]),
            }
            for row in reader
        ]


def load_cennik():
    with CENNIK_FILE.open(encoding="utf-8", newline="") as file:
        reader = csv.DictReader(file, delimiter="\t")
        return {
            row["odmiana"]: float(row["cena"].replace(",", "."))
            for row in reader
        }


@app.route("/api/analiza/top-klienci-zimowe", methods=["GET"])
def top_klienci_zimowe():
    kilogramy_po_kliencie = {}

    for transakcja in load_jablka():
        if transakcja["typ"] != "Z":
            continue

        nip = transakcja["nip"]
        kilogramy_po_kliencie[nip] = (
            kilogramy_po_kliencie.get(nip, 0) + transakcja["kg"]
        )

    top_klienci = sorted(
        kilogramy_po_kliencie.items(),
        key=lambda klient: klient[1],
        reverse=True
    )[:3]

    return jsonify(
        {
            "status": "success",
            "analiza": "7.1",
            "nazwa": "Top 3 klienci - jablka zimowe",
            "data": {
                "top_klienci": [
                    {"nip": nip, "kilogramy": kilogramy}
                    for nip, kilogramy in top_klienci
                ]
            },
        }
    )

@app.route

@app.route("/api/analiza/przychod", methods=["GET"])
def przychod():
    cennik = load_cennik()
    calkowity_przychod = 0
    przychod_po_odmianie = {}

    for transakcja in load_jablka():
        odmiana = transakcja["odmiana"]
        przychod_transakcji = cennik[odmiana] * transakcja["kg"]

        calkowity_przychod += przychod_transakcji
        przychod_po_odmianie[odmiana] = (
            przychod_po_odmianie.get(odmiana, 0) + przychod_transakcji
        )

    top_odmiany = sorted(
        przychod_po_odmianie.items(),
        key=lambda odmiana: odmiana[1],
        reverse=True,
    )
    najlepsza_odmiana, przychod_najlepszej = top_odmiany[0]
    
    return jsonify(
        {
            "status": "success",
            "analiza": "7.2",
            "nazwa": "Przychod i najlepsza odmiana",
            "data": {
                "calkowity_przychod": round(calkowity_przychod, 2),
                "najlepsza_odmiana": najlepsza_odmiana,
                "przychod_najlepszej": round(przychod_najlepszej, 2),
                "top_odmiany": [
                    {"odmiana": odmiana, "przychod": round(przychod, 2)}
                    for odmiana, przychod in top_odmiany[:3]
                ],
            },
        }
    )


@app.route("/api/analiza/popularnosc-miesiecy", methods=["GET"])
def popularnosc_miesiecy():
    nazwy_miesiecy = {
        "01": "Styczen",
        "02": "Luty",
        "03": "Marzec",
        "04": "Kwiecien",
        "05": "Maj",
        "06": "Czerwiec",
        "07": "Lipiec",
        "08": "Sierpien",
        "09": "Wrzesien",
        "10": "Pazdziernik",
        "11": "Listopad",
        "12": "Grudzien",
    }
    kilogramy_po_miesiacu = {}
    
    for transakcja in load_jablka():
        miesiac = transakcja["data"][:7]
        odmiana = transakcja["odmiana"]

        if miesiac not in kilogramy_po_miesiacu:
            kilogramy_po_miesiacu[miesiac] = {}

        kilogramy_po_miesiacu[miesiac][odmiana] = (
            kilogramy_po_miesiacu[miesiac].get(odmiana, 0) + transakcja["kg"]
        )

    miesiace = []
    for numer_miesiaca in range(1, 13):
        miesiac = f"2022-{numer_miesiaca:02d}"
        najpopularniejsza, kilogramy = max(
            kilogramy_po_miesiacu[miesiac].items(),
            key=lambda odmiana: odmiana[1],
        )
        miesiace.append(
            {
                "miesiac": miesiac,
                "miesiac_nazwa": nazwy_miesiecy[miesiac[-2:]],
                "najpopularniejsza": najpopularniejsza,
                "kilogramy": kilogramy,
            }
        )

    return jsonify(
        {
            "status": "success",
            "analiza": "7.3",
            "nazwa": "Najpopularniejsza odmiana w kazdym miesiacu",
            "data": {
                "miesiace": miesiace
            }
        }
    )


@app.route("/api/analiza/rabaty", methods=["GET"])
def rabaty():
    kilogramy_po_kliencie = {}
    liczba_transakcji_z_rabatem = 0
    calkowita_wartosc_rabatow = 0
    przedzial_5_groszy = {
        "liczba_transakcji": 0,
        "calkowita_wartosc": 0,
    }
    przedzial_10_groszy = {
        "liczba_transakcji": 0,
        "calkowita_wartosc": 0,
    }

    transakcje = sorted(load_jablka(), key=lambda transakcja: transakcja["data"])

    for transakcja in transakcje:
        nip = transakcja["nip"]
        kg = transakcja["kg"]
        dotychczasowe_kg = kilogramy_po_kliencie.get(nip, 0)

        if dotychczasowe_kg >= 20000:
            rabat_za_kg = 0.10
            przedzial = przedzial_10_groszy
        elif dotychczasowe_kg >= 15000:
            rabat_za_kg = 0.05
            przedzial = przedzial_5_groszy
        else:
            rabat_za_kg = 0
            przedzial = None

        if przedzial is not None:
            wartosc_rabatu = kg * rabat_za_kg
            liczba_transakcji_z_rabatem += 1
            calkowita_wartosc_rabatow += wartosc_rabatu
            przedzial["liczba_transakcji"] += 1
            przedzial["calkowita_wartosc"] += wartosc_rabatu

        kilogramy_po_kliencie[nip] = dotychczasowe_kg + kg

    return jsonify(
        {
            "status": "success",
            "analiza": "7.4",
            "nazwa": "System rabatow dla klientow hurtowych",
            "data": {
                "liczba_transakcji_z_rabatem": liczba_transakcji_z_rabatem,
                "calkowita_wartosc_rabatow": round(calkowita_wartosc_rabatow, 2),
                "przedzial_5_groszy": {
                    "liczba_transakcji": przedzial_5_groszy["liczba_transakcji"],
                    "calkowita_wartosc": round(
                        przedzial_5_groszy["calkowita_wartosc"], 2
                    ),
                },
                "przedzial_10_groszy": {
                    "liczba_transakcji": przedzial_10_groszy["liczba_transakcji"],
                    "calkowita_wartosc": round(
                        przedzial_10_groszy["calkowita_wartosc"], 2
                    ),
                },
            },
        }
    )


if __name__ == "__main__":
    app.run(debug=True, port=5002)
