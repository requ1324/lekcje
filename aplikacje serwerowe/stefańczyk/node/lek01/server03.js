import { createServer } from "http";
const PORT = 3000;
const server = createServer((req, res) => {
  switch (req.url) {
    case "/":
      res.writeHead(200, { "content-type": "text/html;charset=utf-8" });
      res.end(
        "<ul><li><a href='/headers'>headers</a></li><li><a href='/rawHeaders'>rawHeaders</a></li></ul>",
      );
      break;
    case "/headers":
      res.writeHead(200, { "content-type": "application/json;charset=utf-8" });
      res.end(JSON.stringify(req.headers, null, 5));
      break;
    case "/rawHeaders":
      res.writeHead(200, { "content-type": "application/json;charset=utf-8" });
      res.end(JSON.stringify(req.rawHeaders, null, 5));
      break;
  }
});

server.listen(PORT, () => {
  console.log(`serwer startuje na porcie ${PORT}`);
});
