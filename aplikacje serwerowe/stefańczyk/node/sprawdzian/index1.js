import { createServer } from "http";
import { readFile } from "fs/promises";
import { resolve } from "path";

const server = createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  console.log(parsedUrl);
  if (pathname === "/index01") {
    readFile(resolve("static", "index01.html"))
      .then((html) => {
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(html);
      })
      .catch(() => {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Nie znaleziono pliku HTML");
      });
  }
  if (pathname === "/wybor") {
    const postac = parsedUrl.searchParams.get("postac");
    const lvl = parsedUrl.searchParams.get("lvl");

    const imageMap = {
      wojownik: "wojownik.jpg",
      mag: "mag.jpg",
      lucznik: "lucznik.jpg",
    };

    const imgName = imageMap[postac];
    const imgUrl = `/images/${imgName}`;

    const html = `
            <!DOCTYPE html>
            <html lang="pl">
            <head><meta charset="UTF-8"><title>Postać</title></head>
            <body>
                <h1>Wybrano: ${postac}</h1>
                <p>Poziom: ${lvl}</p>
                <img src="${imgUrl}" width="300">
                <br>
                <a href="/index01">Powrót</a>
            </body>
            </html>
        `;
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(html);
  }

  if (pathname.startsWith("/images/")) {
    const fileName = pathname.split("/").pop();
    const filePath = resolve("static", "images", fileName);

    readFile(filePath)
      .then((data) => {
        res.writeHead(200, { "Content-Type": "image/jpeg" });
        res.end(data);
      })
      .catch(() => {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Nie znaleziono obrazka");
      });
  }
});

server.listen(3000, () => {
  console.log("serwer działa na porcie 3000");
});
