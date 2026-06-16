from collections import Counter, defaultdict
from decimal import Decimal
from flask import Blueprint, jsonify

from storage import load_prices, load_transactions

analiza_bp = Blueprint('analiza', __name__)

prices = load_prices()
transactions = load_transactions()


def decimal_to_float(value: Decimal) -> float:
    return float(value.quantize(Decimal('0.01')))


def json_response(data: dict, status: str = 'success') -> dict:
    return {'status': status, **data}


@analiza_bp.route('/', methods=['GET'])
def root():
    return jsonify(json_response({
        'message': 'Hurtownia jabłek API - użyj /api/analiza/*',
    }))


@analiza_bp.route('/api/analiza/top-klienci-zimowe', methods=['GET'])
def top_klienci_zimowe():
    klient_kg = Counter()
    for tx in transactions:
        if tx.typ.upper() == 'Z':
            klient_kg[tx.nip] += tx.kg

    top_3 = [{'nip': nip, 'kilogramy': kg} for nip, kg in klient_kg.most_common(3)]

    return jsonify(json_response({
        'analiza': '7.1',
        'nazwa': 'Top 3 klienci - jabłka zimowe',
        'data': {'top_klienci': top_3},
    }))


@analiza_bp.route('/api/analiza/przychod', methods=['GET'])
def przychod():
    przychod_wariant = defaultdict(Decimal)
    total = Decimal('0.00')

    for tx in transactions:
        cena = prices.get(tx.odmiana, Decimal('0.00'))
        wartosc = cena * tx.kg
        przychod_wariant[tx.odmiana] += wartosc
        total += wartosc

    najlepsza = max(przychod_wariant.items(), key=lambda item: item[1], default=(None, Decimal('0.00')))
    top_odmiany = sorted(przychod_wariant.items(), key=lambda item: item[1], reverse=True)[:5]

    return jsonify(json_response({
        'analiza': '7.2',
        'nazwa': 'Przychód i najlepsza odmiana',
        'data': {
            'calkowity_przychod': decimal_to_float(total),
            'najlepsza_odmiana': najlepsza[0],
            'przychod_najlepszej': decimal_to_float(najlepsza[1]),
            'top_odmiany': [
                {'odmiana': odmiana, 'przychod': decimal_to_float(value)}
                for odmiana, value in top_odmiany
            ],
        },
    }))


@analiza_bp.route('/api/analiza/popularnosc-miesiecy', methods=['GET'])
def popularnosc_miesiecy():
    miesiac_data = defaultdict(Counter)
    for tx in transactions:
        key = tx.data.strftime('%Y-%m')
        miesiac_data[key][tx.odmiana] += tx.kg

    nazwy_miesiecy = {
        '01': 'Styczeń',
        '02': 'Luty',
        '03': 'Marzec',
        '04': 'Kwiecień',
        '05': 'Maj',
        '06': 'Czerwiec',
        '07': 'Lipiec',
        '08': 'Sierpień',
        '09': 'Wrzesień',
        '10': 'Październik',
        '11': 'Listopad',
        '12': 'Grudzień',
    }

    result = []
    for month in sorted(miesiac_data.keys()):
        top = miesiac_data[month].most_common(1)
        if not top:
            continue
        odmiana, kg = top[0]
        result.append({
            'miesiac': month,
            'miesiac_nazwa': nazwy_miesiecy.get(month.split('-')[1], month),
            'najpopularniejsza': odmiana,
            'kilogramy': kg,
        })

    return jsonify(json_response({
        'analiza': '7.3',
        'nazwa': 'Najpopularniejsza odmiana w każdym miesiącu',
        'data': {'miesiace': result},
    }))


@analiza_bp.route('/api/analiza/rabaty', methods=['GET'])
def rabaty():
    sorted_transactions = sorted(transactions, key=lambda tx: (tx.data, tx.nip, tx.odmiana))
    klient_kg = defaultdict(int)
    rabaty_count = 0
    rabat_total = Decimal('0.00')

    for tx in sorted_transactions:
        previous_kg = klient_kg[tx.nip]
        discount_rate = Decimal('0.00')
        if previous_kg >= 20000:
            discount_rate = Decimal('0.10')
        elif 15000 <= previous_kg < 20000:
            discount_rate = Decimal('0.05')

        if discount_rate > 0:
            rabaty_count += 1
            price = prices.get(tx.odmiana, Decimal('0.00'))
            rabat_total += price * tx.kg * discount_rate

        klient_kg[tx.nip] += tx.kg

    return jsonify(json_response({
        'analiza': '7.4',
        'nazwa': 'System rabatów klienta',
        'data': {
            'transakcji_z_rabatem': rabaty_count,
            'wartosc_rabatow': decimal_to_float(rabat_total),
        },
    }))
