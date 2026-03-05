import { readFile } from "fs";
import path from "path";
import { createServer } from "http";
const __dirname = path.resolve(); // Pobranie ścieżki do bieżącego folderu
const mypath = path.join(__dirname, "static", "index.html");

const PORT = 3000;
const server = createServer((req, res) => {
  readFile(mypath, (error, data) => {
    if (error) {
      res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      res.end("<h1>Błąd 404 - nie znaleziono pliku!</h1>");
    } else {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(data); // "data" to zawartość pliku index.html
    }
  });
});

server.listen(PORT, () => {
  console.log(`serwer startuje na porcie ${PORT}`);
});
