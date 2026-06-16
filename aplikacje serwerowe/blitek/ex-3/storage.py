import csv
from dataclasses import dataclass
from datetime import datetime
from decimal import Decimal, ROUND_HALF_UP
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
CENNIK_FILE = BASE_DIR / 'data' / 'cennik.txt'
JABLKA_FILE = BASE_DIR / 'data' / 'jablka.txt'


@dataclass(frozen=True)
class Transaction:
    data: datetime
    odmiana: str
    typ: str
    nip: str
    kg: int


def parse_price(value: str) -> Decimal:
    return Decimal(value.replace(',', '.')).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)


def load_prices() -> dict:
    prices = {}
    with CENNIK_FILE.open('r', encoding='utf-8') as file:
        reader = csv.DictReader(file, delimiter='\t')
        for row in reader:
            prices[row['odmiana'].strip()] = parse_price(row['cena'].strip())
    return prices


def load_transactions() -> list:
    transactions = []
    with JABLKA_FILE.open('r', encoding='utf-8') as file:
        reader = csv.DictReader(file, delimiter='\t')
        for row in reader:
            transactions.append(Transaction(
                data=datetime.fromisoformat(row['data'].strip()).date(),
                odmiana=row['odmiana'].strip(),
                typ=row['typ'].strip(),
                nip=row['nip'].strip(),
                kg=int(row['kg'].strip()),
            ))
    return transactions
