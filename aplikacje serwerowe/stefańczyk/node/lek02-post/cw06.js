import { createServer } from "http";
import { readFile } from "fs/promises";
import { resolve } from "path";
const PORT = 3000;
const server = createServer((req, res) => {
  switch (req.method) {
    case "GET":
      readFile(resolve("static", "index06.html"))
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
        // Uwaga: dane z formularza nie przychodzą jako JSON, tylko w formacie: username=Jan&innepole=wartosc
        console.log(`Odebrano dane: ${body}`);

        res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
        const liczby = JSON.parse(body);
        const suma = liczby.reduce((a, b) => a + b, 0);
        res.end(`Suma liczb to ${suma}`);
      });
      break;
  }
});

server.listen(PORT, () => {
  console.log(`serwer startuje na porcie ${PORT}`);
});
