import { createServer } from "http";
const PORT = 3000;
const server = createServer((req, res) => {
  switch (req.method) {
    case "GET":
      res.end("Metoda GET służy do pobierania");
      break;
    case "POST":
      res.end("Odebrano POST, dane zostały wysłane");
      break;
  }
});

server.listen(PORT, () => {
  console.log(`serwer startuje na porcie ${PORT}`);
});
