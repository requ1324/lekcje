import { createServer } from "http";
/*const m1 = (req, res, next) => {
  console.log("[m1] Ustawiam wartość bazową: 10");
  req.val = 10;
  // Przekazujemy sterowanie dalej i kończymy obecną funkcję
  return next();
};

const m2 = (req, res, next) => {
  console.log("[m2] Sprawdzam warunek i mnożę x2");

  if (req.val < 5) {
    // Jeśli warunek nie jest spełniony, przerywamy potok z błędem
    return next("Wartość początkowa jest zbyt mała!");
  }

  req.val *= 2;
  return next();
};
*/
/**
 * Funkcja run zarządza przechodzeniem przez tablicę funkcji.
 * Zastępuje ona zwykłą pętlę forEach, umożliwiając zatrzymanie procesu.
 */

const authenticate = (req, res, next) => {
  console.log("[1] Autoryzacja...");
  req.user = { id: 42, name: "Tomek", isAuthenticated: true };
  next(); // Przejdź dalej
};

const checkStock = (req, res, next) => {
  console.log("[2] Sprawdzanie magazynu...");
  if (!req.user.isAuthenticated) {
    return next("Użytkownik nie jest uwierzytelniony!");
  } else {
    res.write(`Zamowienie dla: ${req.user.name}\n`);
  }
  req.stock = { item: "Laptop Pro 15", available: true, price: 5000 };
  next(); // Przejdź dalej
};

const applyDiscount = (req, res, next) => {
  console.log("[3] Naliczanie rabatu...");
  if (!req.stock.available) {
    return next("Produkt niedostępny!");
  } else {
    res.write(`Produkt: ${req.stock.item}\n`);
  }
  req.discount = { value: 0.1 };
  next(); // Przejdź dalej
};

function run(req, res, middlewares) {
  let index = 0;

  // Definiujemy wewnętrzną funkcję 'next' (ma przypominać exptress-a)
  function next(err) {
    // Obsługa błędu - jeśli jakikolwiek middleware zgłosił błąd
    if (err) {
      res.statusCode = 500;
      return res.end(`STOP! Napotkano błąd: ${err}`);
    }

    // Sprawdzamy, czy są jeszcze kolejne funkcje w kolejce
    if (index < middlewares.length) {
      const currentMiddleware = middlewares[index++];

      // Wywołujemy middleware, przekazując mu tę samą funkcję next
      // (To jest rekurencja - funkcja wywołuje funkcję, która wywołuje next)
      return currentMiddleware(req, res, next);
    }

    // Jeśli dotarliśmy do końca i nikt nie zgłosił błędu
    return res.end(
      `Cena po rabacie: ${req.stock.price * (1 - req.discount.value)} PLN`,
    );
  }

  // Odpalamy pierwszy krok
  return next();
}

const server = createServer((req, res) => {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");

  // Definiujemy tablicę kroków (pipeline)
  const pipeline = [authenticate, checkStock, applyDiscount];

  // Uruchamiamy proces
  run(req, res, pipeline);
});

server.listen(3000, () => {
  console.log("Serwer działa na http://localhost:3000");
});
