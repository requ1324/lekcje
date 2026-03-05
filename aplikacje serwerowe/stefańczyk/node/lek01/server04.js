import { createServer } from "http";
const PORT = 3000;
const server = createServer((req, res) => {
  const userAgent = req.headers["user-agent"];
  res.writeHead(200, { "content-type": "text/html;charset=utf-8" });
  if (userAgent.includes("Chrome")) {
    res.end("<h1>Uzywasz Chrome</h1>");
  } else if (userAgent.includes("Firefox")) {
    res.end("<h1>Uzywasz Firefox</h1>");
  } else if (userAgent.includes("Safari")) {
    res.end("<h1>Uzywasz Safari</h1>");
  }
});

server.listen(PORT, () => {
  console.log(`serwer startuje na porcie ${PORT}`);
});
