import { createServer } from "http";
const PORT = 3000;
const server = createServer((req, res) => {
  const baseUrl = `http://${req.headers.host}`;
  const myUrl = new URL(req.url, baseUrl);
  console.log("baseUrl:", baseUrl);
  console.log("myUrl:", myUrl);
  const name = myUrl.searchParams.get("name");
  console.log("Witaj, " + name);
  res.end("Witaj, " + name);
});

server.listen(PORT, () => {
  console.log(`serwer startuje na porcie ${PORT}`);
});
