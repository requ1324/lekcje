import { createServer } from "http";
import tracer from "tracer";
const log = tracer.colorConsole();
const PORT = 3000;

const server = createServer((req, res) => {
  const url = decodeURI(req.url.toLowerCase());
  switch (url) {
    case "/":
      res.writeHead(200, { "content-type": "text/html;charset=utf-8" });
      res.end("<p>wpisz /zieleń, /czerwień</p>");
      break;
    case "/zieleń":
      log.info("user wszedl w zielen");
      res.writeHead(200, { "content-type": "text/html;charset=utf-8" });
      res.end("<h1>Informacje o serwerze</h1>");
      break;
    case "/czerwień":
      log.error("user wszedl w czerwien");
      res.writeHead(200, { "content-type": "text/html;charset=utf-8" });
      res.end("<h1>user wszedl w czerwien</h1>");
      break;
    default:
      log.log("Nieznana sciezka: " + url);
      res.writeHead(404, { "content-type": "text/html;charset=utf-8" });
      res.end("<h1>Nieznana sciezka</h1>");
  }
});

server.listen(PORT, () => {
  console.log("server started at port" + PORT);
});
