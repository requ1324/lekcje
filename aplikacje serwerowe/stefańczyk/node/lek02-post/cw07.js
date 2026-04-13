import { createServer } from "http";
import { readFile } from "fs/promises";
import { resolve } from "path";
const PORT = 3000;
const server = createServer((req, res) => {
  switch (req.method) {
    case "GET":
      readFile(resolve("static", "index07.html"))
        .then((html) => {
          res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
          res.end(html);
        })
        .catch(() => {
          res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
          res.end("Nie znaleziono pliku HTML");
        });
      break;
    case "POST":
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        // URLSearchParams pozwala sprawdzić dane w formacie klucz=wartość&klucz=wartość
        const params = new URLSearchParams(body);
        console.log(params);

        // metoda .getAll pobiera wszystkie wartości name 'liczba' do tablicy
        const liczby = params.getAll("liczba");
        let suma = 0;
        for (const liczba of liczby) {
          suma += Number(liczba);
        }
        res.end(
          `Serwer otrzymal liczby: ${liczby.join(", ")} i suma: ${suma}   `,
        );
      });
      break;
  }
});

server.listen(PORT, () => {
  console.log(`serwer startuje na porcie ${PORT}`);
});
