import { readFile } from "fs";
import path from "path";
import { createServer } from "http";
import "colors";

const __dirname = path.resolve(); // Pobranie ścieżki do bieżącego folderu

const PORT = 3000;
const server = createServer((req, res) => {
  const url = decodeURI(req.url.toLowerCase());
  if (url === "/favicon.ico") {
    res.writeHead(204);
    return res.end();
  }
  const files = {
    "/wąż": "wąż.jpg",
    "/mąż": "mąż.jpg",
    "/książ": "książ.jpg",
  };
  const targetFile = files[url];
  if (targetFile) {
    const fullPath = path.join(__dirname, "static", targetFile);
    readFile(fullPath, (error, data) => {
      if (error) {
        console.log(`Błąd: ${targetFile}`.red);
        res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
        res.end("<h1>Błąd 404 - brak zdjęcia!</h1>");
      } else {
        res.writeHead(200, { "Content-Type": "image/jpeg" });
        res.end(data); // Wysyłamy surowe dane binarne obrazu
      }
    });
  }
});

server.listen(PORT, () => {
  console.log(`serwer startuje na porcie ${PORT}`);
});
