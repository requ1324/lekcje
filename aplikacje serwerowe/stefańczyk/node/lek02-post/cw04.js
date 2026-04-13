import { createServer } from "http";
import { readFile } from "fs/promises";
import { resolve } from "path";
const PORT = 3000;
const server = createServer((req, res) => {
  switch (req.method) {
    case "GET":
      readFile(resolve("static", "index04.html"))
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
        // Wszystko co odesłane w res.end() trafia z powrotem do funkcji fetch
        console.log("Odebrano dane:", body);
        res.end(`Serwer otrzymał: ${body}`);
      });
      break;
  }
});

server.listen(PORT, () => {
  console.log(`serwer startuje na porcie ${PORT}`);
});
