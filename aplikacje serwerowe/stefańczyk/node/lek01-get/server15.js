import { readFile } from "fs";
import path from "path";
import { createServer } from "http";
import "colors";

const __dirname = path.resolve(); // Pobranie ścieżki do bieżącego folderu

const PORT = 3000;

const types = {
  ".html": "text/html; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
};

const server = createServer((req, res) => {
  const url = decodeURI(req.url.toLowerCase());
  let finalPath = path.join(__dirname, "static", url);
  if (url == "/") {
    finalPath = path.join(__dirname, "static", "index.html");
  }
  console.log(url);
  const ext = path.extname(finalPath);
  const contentType = types[ext];
  readFile(finalPath, (error, data) => {
    if (error) {
      console.log(`Błąd: ${finalPath}`.red);
      res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      res.end("<h1>Błąd 404 - brak zdjęcia!</h1>");
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(data);
    }
  });
});

server.listen(PORT, () => {
  console.log(`serwer startuje na porcie ${PORT}`);
});
